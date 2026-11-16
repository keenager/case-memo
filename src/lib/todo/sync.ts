import type { Editor, MarkType } from "@tiptap/core";
import type { TodoInFront } from "./types";

export default function syncEditorWithDB(
	editor: Editor,
	todoList: TodoInFront[],
) {
	const { state, view } = editor;
	const { doc, schema, tr } = state;
	const todoMark = schema.marks.todoHighlight;
	console.log("todoMark: ", todoMark);
	if (!todoMark) return;

	const todoMap = new Map(todoList.map((t) => [String(t.id), t]));

	const replacements: {
		from: number;
		to: number;
		todo: TodoInFront | undefined;
		existingMark: MarkType;
	}[] = [];

	doc.descendants((node, pos) => {
		console.log("node: ", node);
		console.log("node.isText: ", node.isText);
		if (!node.isText) return;
		const existingMark = node.marks.find((m) => {
			console.log("m.type === todoMark: ", m.type === todoMark);
			console.log(" m.attrs.todoId: ", m.attrs.todoId);

			return m.type === todoMark && m.attrs.todoId;
		});
		console.log("existingMark: ", existingMark);
		// console.log("existingMark: ", existingMark);
		if (!existingMark) return;
		replacements.push({
			from: pos,
			to: pos + node.nodeSize,
			todo: todoMap.get(existingMark.attrs.todoId),
			existingMark,
		});
	});

	console.log("replacements: ", replacements);

	let hasChanges = false;

	for (let i = replacements.length - 1; i >= 0; i--) {
		const { from, to, todo, existingMark } = replacements[i];
		const currentText = doc.textBetween(from, to);

		if (!todo) {
			// 리스트에서 삭제된 경우
			tr.removeMark(from, to, todoMark);
			hasChanges = true;
		} else if (
			// 내용이 변경된 경우
			currentText !== todo.content ||
			existingMark.attrs.isDone !== todo.isDone
		) {
			const updatedMark = todoMark.create({
				...existingMark.attrs,
				isDone: todo.isDone,
			});
			tr.replaceWith(from, to, schema.text(todo.content, [updatedMark]));
			hasChanges = true;
		}
	}

	if (hasChanges) {
		tr.setMeta("isSyncWithDB", true);
		view.dispatch(tr);
	}
}
