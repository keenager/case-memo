import { create } from "zustand";
import type { CamelCase } from "@/lib/camelize";
import type { HearingInDB, HearingInList } from "@/lib/hearing";

type State = {
	hearingList: HearingInList[];
	hearingDataList: CamelCase<HearingInDB>[];
	selectedId: string;
};

export const useHearing = create<State>(() => ({
	hearingList: [],
	hearingDataList: [],
	selectedId: "",
}));

export const setHearingList = (newList: HearingInList[]) =>
	useHearing.setState({ hearingList: newList });

export const setHearingDataList = (newList: CamelCase<HearingInDB>[]) =>
	useHearing.setState({ hearingDataList: newList });

export const setHearingDataListWithPrev = (
	updateFn: (prev: CamelCase<HearingInDB>[]) => CamelCase<HearingInDB>[],
) =>
	useHearing.setState((state) => ({
		hearingDataList: updateFn(state.hearingDataList),
	}));

export const setSelectedId = (newId: string) =>
	useHearing.setState({ selectedId: newId });
