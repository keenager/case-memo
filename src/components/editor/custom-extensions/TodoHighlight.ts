import Highlight from "@tiptap/extension-highlight";

declare module "@tiptap/core" {
	interface Commands<ReturnType> {
		todoHighlight: {
			setTodoHighlight: (attributes?: { todoId: string }) => ReturnType;
			unsetTodoHighlight: () => ReturnType;
		};
	}
}

export const TodoHighlight = Highlight.extend({
	name: "todoHighlight",
	addAttributes() {
		return {
			...this.parent?.(),
			todoId: {
				default: null,
				parseHTML(element) {
					return element.getAttribute("data-todo-id");
				},
				renderHTML(attributes) {
					if (attributes.todoId) return { "data-todo-id": attributes.todoId };
					else return {};
				},
			},
		};
	},
	renderHTML({ HTMLAttributes }) {
		return [
			"mark",
			{ ...HTMLAttributes, "data-todo-highlight": "", class: "todo-highlight" },
			0,
		];
	},
	parseHTML() {
		return [{ tag: "mark[data-todo-highlight]" }];
	},
	addCommands() {
		return {
			setTodoHighlight:
				(attributes) =>
				({ commands }) => {
					return commands.setMark(this.name, attributes);
				},
			// toggleTodoHighlight:
			// 	() =>
			// 	({ commands }) => {
			// 		return commands.toggleMark(this.name);
			// 	},
			unsetTodoHighlight:
				() =>
				({ commands }) => {
					return commands.unsetMark(this.name);
				},
		};
	},
});
