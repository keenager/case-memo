import type { Editor } from "@tiptap/core";
import { Fragment, type Mark, type Node } from "@tiptap/pm/model";
import type { Transaction } from "@tiptap/pm/state";
import type { TodoInFront } from "./types";

export default function syncDocWithDB(editor: Editor, todoList: TodoInFront[]) {
	const { state, view } = editor;
	const { doc, schema, tr } = state;
	const todoMark = schema.marks.todoHighlight;
	if (!todoMark) return;

	const todoMap = new Map(todoList.map((t) => [String(t.id), t]));

	const syncTargets: {
		taskPos: number;
		existingChecked: boolean;
		textFrom: number;
		textTo: number;
		existingMark: Mark;
		todo: TodoInFront | undefined;
	}[] = [];

	// console.log("doc: ", doc);

	doc.descendants((node, pos) => {
		if (node.type.name === "taskItem") {
			const existingChecked = Boolean(node.attrs.checked);

			node.descendants((childNode, childPos) => {
				if (childNode.type.name === "taskList") return false;
				if (!childNode.isText) return;

				const existingMark = childNode.marks.find((m) => {
					return m.type === todoMark && m.attrs.todoId;
				});
				if (!existingMark) return;

				const textFrom = pos + 1 + childPos;
				const textTo = textFrom + childNode.nodeSize;
				syncTargets.push({
					taskPos: pos,
					existingChecked,
					textFrom,
					textTo,
					existingMark,
					todo: todoMap.get(existingMark.attrs.todoId),
				});
			});
		}
	});

	// console.log("syncTargets: ", syncTargets);

	let hasChanges = false;

	for (let i = syncTargets.length - 1; i >= 0; i--) {
		const { taskPos, existingChecked, textFrom, textTo, existingMark, todo } =
			syncTargets[i];

		if (!todo) {
			// 리스트에서 삭제된 경우
			console.log("delete todo start.");
			// 하이라이트 제거
			tr.removeMark(textFrom, textTo, todoMark);
			// 체크박스 제거
			removeCheckBox(tr, taskPos);
			hasChanges = true;
		} else if (existingChecked !== todo.isDone) {
			// 완료 여부가 변경된 경우
			console.log("update todo isDone.");
			tr.setNodeAttribute(taskPos, "checked", todo.isDone);
			hasChanges = true;
		} else if (doc.textBetween(textFrom, textTo) !== todo.content) {
			// 내용이 변경된 경우
			console.log("update todo content");
			// const updatedMark = todoMark.create({
			// 	...existingMark.attrs,
			// 	isDone: todo.isDone,
			// });
			tr.replaceWith(
				textFrom,
				textTo,
				schema.text(todo.content, [existingMark]),
			);
			hasChanges = true;
		}
	}

	if (hasChanges) {
		tr.setMeta("isSyncWithDB", true);
		view.dispatch(tr);
	}
}

const removeCheckBox = (tr: Transaction, taskPos: number) => {
	const taskItemNode = tr.doc.nodeAt(taskPos);
	const $pos = tr.doc.resolve(taskPos);
	const taskListNode = $pos.parent;
	if (
		taskListNode.type.name === "taskList" &&
		taskItemNode &&
		taskItemNode.type.name === "taskItem"
	) {
		const taskListStart = $pos.before($pos.depth);
		const taskListEnd = $pos.after($pos.depth);
		const targetIndex = $pos.index($pos.depth);

		const beforeItems: Node[] = [];
		const afterItems: Node[] = [];

		taskListNode.forEach((child, _, idx) => {
			if (idx < targetIndex) beforeItems.push(child);
			else if (idx > targetIndex) afterItems.push(child);
		});

		const replacementNodes = [];
		if (beforeItems.length > 0) {
			replacementNodes.push(
				taskListNode.type.create(taskListNode.attrs, beforeItems),
			);
		}
		taskItemNode.content.forEach((innerNode) => {
			replacementNodes.push(innerNode);
		});
		if (afterItems.length > 0) {
			replacementNodes.push(
				taskListNode.type.create(taskListNode.attrs, afterItems),
			);
		}
		tr.replaceWith(
			taskListStart,
			taskListEnd,
			Fragment.fromArray(replacementNodes),
		);
	}
};
