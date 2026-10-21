import { load } from "@tauri-apps/plugin-store";
import { create } from "zustand";
import type { SelectItemList } from "@/components/dialog/fields/SelectField";

type SelectItemValue = SelectItemList[number]["value"];
type State = { courtId: SelectItemValue };
type Actions = {
	initialize: (loadedId: SelectItemValue) => void;
	updateCourtId: (newId: SelectItemValue) => void;
};

const settings = await load("settings.json");

export const useDefaultCourt = create<State & Actions>((set) => ({
	courtId: null,
	initialize: (loadedId) => set({ courtId: loadedId }),
	updateCourtId: async (newId) => {
		set({ courtId: newId });
		await settings.set("defaultCourt", newId).catch((error) => {
			console.error("courtId를 settings.json에 저장하던 중 에러 발생.", error);
		});
	},
}));

export const initStoreFromSettingsFile = async () => {
	const loadedCourtId = await settings
		.get<string | null>("defaultCourt")
		.catch((error) =>
			console.error(
				"courtId를 settings.json에서 불러오던 중 에러 발생. null 값으로 대체",
				error,
			),
		);
	useDefaultCourt.getState().initialize(loadedCourtId ?? null);
};
