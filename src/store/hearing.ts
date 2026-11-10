import { create } from "zustand";
import type { CamelCase } from "@/lib/camelize";
import type { HearingInDB, HearingInList } from "@/lib/hearing";

type State = {
	hearingList: HearingInList[];
	hearingDataList: CamelCase<HearingInDB>[];
	selectedId: string | undefined;
};

type Action = {
	setHearingList: (newList: HearingInList[]) => void;
	setHearingDataList: (newList: CamelCase<HearingInDB>[]) => void;
	setHearingDataListWithPrev: (
		updateFn: (prev: CamelCase<HearingInDB>[]) => CamelCase<HearingInDB>[],
	) => void;
	setSelectedId: (newId: string) => void;
};

export const useHearing = create<State & Action>((set) => ({
	hearingList: [],
	hearingDataList: [],
	selectedId: undefined,
	setHearingList: (newList: HearingInList[]) => {
		set({ hearingList: newList });
	},
	setHearingDataList(newList: CamelCase<HearingInDB>[]) {
		set({ hearingDataList: newList });
	},
	setHearingDataListWithPrev: (updateFn) => {
		set((state) => ({ hearingDataList: updateFn(state.hearingDataList) }));
	},
	setSelectedId: (newId: string) => {
		set({ selectedId: newId });
	},
}));
