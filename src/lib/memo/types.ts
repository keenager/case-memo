import type { Editor } from "@tiptap/core";
import type { SectionCategory } from "../sections";

type BaseArgsForSaveMemo = {
	caseId: string;
	// sectionCategory: SectionCategory;
	contents: ReturnType<Editor["getJSON"]>;
};

type BaseArgsForEditor = {
	caseId: string;
	contents: string | undefined;
};

type AddArgsForHearings = {
	sectionCategory: "hearings";
	hearingId: string;
};
type AddArgsForOthers = {
	sectionCategory: Exclude<SectionCategory, "hearings">;
	// hearingId?: undefined;
};

export type ArgsForSaveMemo =
	| (BaseArgsForSaveMemo & AddArgsForHearings)
	| (BaseArgsForSaveMemo & AddArgsForOthers);

export type ArgsForEditor =
	| (BaseArgsForEditor & AddArgsForHearings)
	| (BaseArgsForEditor & AddArgsForOthers);

// export type ArgsForSaveMemo = BaseArgsForSaveMemo & {
// 	sectionCategory: SectionCategory;
// 	hearingId?: string;
// };

export type Memo = {
	id: number;
	caseId: number;
	sectionType: SectionCategory;
	hearingId?: number;
	contents?: string;
	createdAt: string;
	updatedAt: string;
};
