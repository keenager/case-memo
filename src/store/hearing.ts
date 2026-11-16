import { create } from "zustand";
import type { CamelCase } from "@/lib/camelize";
import type { HearingInDB, HearingInList } from "@/lib/hearing";

type State = {
	hearingList: HearingInList[];
	hearingDataList: CamelCase<HearingInDB>[];
	selectedId: number;
};

export const useHearing = create<State>(() => ({
	hearingList: [],
	hearingDataList: [],
	selectedId: 0,
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

export const setSelectedId = (newId: number) =>
	useHearing.setState({ selectedId: newId });
