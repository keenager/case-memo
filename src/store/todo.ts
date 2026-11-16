import { create } from "zustand";
import type { TodoInFront } from "@/lib/todo/types";

type State = { todoList: TodoInFront[] | null };

export const useTodo = create<State>(() => ({ todoList: null }));

export const setTodoList = (newList: TodoInFront[]) =>
	useTodo.setState({ todoList: newList });
