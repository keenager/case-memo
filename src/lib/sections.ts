import { Route as HearingsRouteRoute } from "@/routes/$caseId/hearings/route";
import { Route as NotesRoute } from "@/routes/$caseId/notes";
import { Route as PrinciplesPrecedentsRoute } from "@/routes/$caseId/principles-precedents";
// import { Route as TriralsTrialsIdRoute } from "./routes/$caseNumber/trirals/$trialsId";
// import { Route as TriralsRouteRoute } from "./routes/$caseNumber/trirals/route";
import { Route as WitnessTestimonyRoute } from "@/routes/$caseId/witness-testimony";

export const SECTION_CATEGORIES = [
	"hearings",
	"principles-precedents",
	"witness-testimony",
	"notes",
] as const;

export type SectionCategory = (typeof SECTION_CATEGORIES)[number];

export const SECTIONS: Record<
	SectionCategory,
	{ title: string; route: string }
> = {
	hearings: {
		title: "기일 진행",
		route: HearingsRouteRoute.fullPath,
	},
	"principles-precedents": {
		title: "관련 법리 및 판례",
		route: PrinciplesPrecedentsRoute.fullPath,
	},
	"witness-testimony": {
		title: "증인 진술 요지",
		route: WitnessTestimonyRoute.fullPath,
	},
	notes: {
		title: "기타 메모",
		route: NotesRoute.fullPath,
	},
};

export type Section = (typeof SECTIONS)[SectionCategory];
