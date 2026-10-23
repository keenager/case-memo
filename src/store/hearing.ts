import { create } from "zustand";

type State = {
	selectedId: string | undefined;
};

type Action = {
	setSelectedId: (newId: string) => void;
};

export const useHearing = create<State & Action>((set) => ({
	selectedId: undefined,
	setSelectedId: (newId: string) => {
		set({ selectedId: newId });
	},
}));
