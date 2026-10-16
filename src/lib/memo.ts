import type { Editor } from "@tiptap/core";
import type { SectionCategory } from "./sections";

type BaseArgsForSaveMemo = {
	caseId: string;
	// sectionCategory: SectionCategory;
	contents: ReturnType<Editor["getJSON"]>;
};
export type ArgsForSaveMemo =
	| (BaseArgsForSaveMemo & { sectionCategory: "hearings"; hearingId: string })
	| (BaseArgsForSaveMemo & {
			sectionCategory: Exclude<SectionCategory, "hearings">;
	  });

export type Memo = {
	id: number;
	caseId: number;
	sectionType: SectionCategory;
	hearingId?: number;
	contents: string;
	createdAt: string;
	updatedAt: string;
};
