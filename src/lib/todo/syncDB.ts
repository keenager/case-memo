import type { Editor } from "@tiptap/core";
import type { Node } from "@tiptap/pm/model";
import type { Transaction } from "@tiptap/pm/state";
import { setTodoList, useTodo } from "@/store/todo";
import { createUpdateTodo } from "../db/createUpdate";

export const syncDBandListWithDoc = (
	editor: Editor,
	transaction: Transaction,
) => {
	if (!transaction.docChanged) return;

	transaction.steps.forEach((step) => {
		const stepJson = step.toJSON();
		if (stepJson.stepType !== "replaceAround") return;

		const prevNode = transaction.before.nodeAt(stepJson.from);
		const nextNode = editor.state.doc.nodeAt(stepJson.from);
		// console.log("prevNode: ", prevNode);
		// console.log("nextNode: ", nextNode);

		if (
			prevNode?.type.name === "taskItem" &&
			nextNode?.type.name === "taskItem" &&
			prevNode.attrs.checked !== nextNode.attrs.checked
		) {
			// console.log("changed!!! changed value: ", nextNode.attrs.checked);
			nextNode.descendants((childNode) => {
				const todoId = getTodoIdFromNode(childNode);
				if (todoId) {
					updateTodo(todoId, nextNode.attrs.checked);
					return false;
				}
			});
		}
	});
};

const getTodoIdFromNode = (node: Node): string | undefined => {
	if (node.marks.length > 0) {
		const targetMark = node.marks.find((mark) => "todoId" in mark.attrs);
		const todoId = targetMark?.attrs.todoId;

		return todoId;
	}
};

const updateTodo = async (todoId: string, isDone: boolean) => {
	let targetIdx = 0;
	const prevList = useTodo.getState().todoList;
	if (!prevList) return;
	const prevTodo = prevList.find((t, idx) => {
		targetIdx = idx;
		return t.id === Number(todoId);
	});
	if (!prevTodo) return;
	const newTodo = { ...prevTodo, isDone };
	await createUpdateTodo(newTodo, todoId);
	setTodoList(prevList?.toSpliced(targetIdx, 1, newTodo));
};
