import type { Editor } from "@tiptap/core";
import { BubbleMenu } from "@tiptap/react/menus";
import { type ReactNode, useState } from "react";
import TodoDiaglog from "@/components/dialog/TodoDialog";
import { Button } from "@/components/ui/button";
import { deleteTodo } from "@/lib/db/delete";
import { handleError } from "@/lib/error";
import { setTodoList, useTodo } from "@/store/todo";
import { useBubbleForTodo } from "./useBubbleForTodo";

export default function BubbleMenuForTodo({ editor }: { editor: Editor }) {
	const [existingTodoId, setExistingTodoId] = useState<string | undefined>(
		undefined,
	);
	const { setOpen } = useBubbleForTodo(editor, existingTodoId);

	const deleteHandler = async (todoId: string | undefined) => {
		try {
			if (!todoId) throw new Error(`잘못된 todoId${todoId} 입니다.`);

			await deleteTodo(todoId);

			const newList = useTodo
				.getState()
				.todoList?.filter((t) => t.id.toString() !== todoId);
			setTodoList(newList ?? []);

			editor
				.chain()
				.focus()
				.extendMarkRange("todoHighlight")
				.unsetTodoHighlight()
				.setTextSelection(editor.state.selection.to)
				.run();
		} catch (error) {
			handleError(error);
		}
	};
	return (
		<BubbleMenu
			editor={editor}
			className="z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95"
			options={{
				placement: "right-start",
				onShow() {
					const todoId = editor.getAttributes("todoHighlight").todoId as
						| string
						| undefined;
					setExistingTodoId(todoId);
				},
			}}
		>
			<div>
				<MenuLabel>할 일 관리</MenuLabel>
				<TodoDiaglog editor={editor} existingTodoId={existingTodoId}>
					<MenuItem
						text={existingTodoId ? "할 일 수정" : "할 일 추가"}
						onClick={() => {
							setOpen(true);
						}}
					/>
				</TodoDiaglog>
				{existingTodoId && (
					<MenuItem
						text="할 일 삭제"
						onClick={() => {
							deleteHandler(existingTodoId);
						}}
					/>
				)}
			</div>
			<MenuSeparator />
			<div>
				<MenuLabel>레이블 2</MenuLabel>
				<MenuItem text="다른 메뉴 1" />
				<MenuItem text="다른 메뉴 2" />
				<MenuItem text="다른 메뉴 3" />
			</div>
		</BubbleMenu>
	);
}

const MenuLabel = ({ children }: { children: ReactNode }) => {
	return (
		<div className="px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7">
			{children}
		</div>
	);
};

const MenuSeparator = () => {
	return <div className="-mx-1 my-1 h-px bg-border"></div>;
};

const MenuItem = ({
	text,
	onClick,
}: {
	text: string;
	onClick?: () => void;
}) => {
	return (
		<div className="relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive">
			<Button
				onClick={onClick}
				variant="ghost"
				className="h-auto w-full justify-start rounded-sm px-2 py-1.5 text-sm font-normal hover:bg-accent hover:text-accent-foreground"
			>
				{text}
			</Button>
		</div>
	);
};
