import { create } from "zustand";

type State = { currentMemoId: number | undefined };
type Action = {
	setCurrentMemoId: (newId: number | undefined) => void;
};

export const useMemo = create<State & Action>((set) => ({
	currentMemoId: undefined,
	setCurrentMemoId: (newId: number | undefined) => {
		set({ currentMemoId: newId });
	},
}));
