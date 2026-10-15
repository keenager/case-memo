import type { Editor } from "@tiptap/core";
import type { SectionCategory } from "./sections";

type BaseArgsForSaveMemo = {
	caseNumber: string;
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
	case_id: number;
	section_type: SectionCategory;
	hearing_id?: number;
	contents: string;
	created_at: string;
	updated_at: string;
};
