import type z from "zod";
import { create } from "zustand";
import type { TodoSchema } from "@/lib/todo/todo";

type Todo = { id?: number } & z.infer<typeof TodoSchema>;

type State = { todoList: Todo[] };

export const useTodo = create<State>(() => ({ todoList: [] }));

export const setTodoList = (newList: Todo[]) =>
	useTodo.setState({ todoList: newList });
