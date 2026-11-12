import { create } from "zustand";
import type { CamelCase } from "@/lib/camelize";
import {
	type HearingInDB,
	type HearingInList,
	initialAttendanceData,
} from "@/lib/hearing";

type State = {
	hearingList: HearingInList[];
	hearingDataList: CamelCase<HearingInDB>[];
	selectedId: string;
	currentData: CamelCase<HearingInDB>;
};

type Action = {
	setHearingList: (newList: HearingInList[]) => void;
	setHearingDataList: (newList: CamelCase<HearingInDB>[]) => void;
	setHearingDataListWithPrev: (
		updateFn: (prev: CamelCase<HearingInDB>[]) => CamelCase<HearingInDB>[],
	) => void;
	setSelectedId: (newId: string) => void;
	setCurrentData: (newData: CamelCase<HearingInDB> | undefined) => void;
};

export const useHearing = create<State & Action>((set, get) => ({
	hearingList: [],
	hearingDataList: [],
	selectedId: "",
	currentData: {
		id: 0,
		caseId: "",
		hearingDate: "",
		hearingTime: "",
		...initialAttendanceData,
	},
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
	setCurrentData(newData) {
		set({ currentData: newData });
	},
}));
