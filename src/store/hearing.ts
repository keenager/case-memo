import { create } from "zustand";
import type { HearingInList } from "@/lib/hearing";

type State = {
	hearingList: HearingInList[];
	selectedId: string | undefined;
};

type Action = {
	setHearingList: (newList: HearingInList[]) => void;
	setSelectedId: (newId: string) => void;
};

export const useHearing = create<State & Action>((set) => ({
	hearingList: [],
	selectedId: undefined,
	setHearingList: (newList: HearingInList[]) => {
		set({ hearingList: newList });
	},
	setSelectedId: (newId: string) => {
		set({ selectedId: newId });
	},
}));
