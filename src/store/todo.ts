import { create } from "zustand";
import type { TodoInFront } from "@/lib/todo/todo";

type State = { todoList: TodoInFront[] };

export const useTodo = create<State>(() => ({ todoList: [] }));

export const setTodoList = (newList: TodoInFront[]) =>
	useTodo.setState({ todoList: newList });
