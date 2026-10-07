import type { Section } from "@/lib/types";
import { Route as HearingsRouteRoute } from "@/routes/$caseNumber/hearings/route";
import { Route as NotesRoute } from "@/routes/$caseNumber/notes";
import { Route as PrinciplesPrecedentsRoute } from "@/routes/$caseNumber/principles-precedents";
// import { Route as TriralsTrialsIdRoute } from "./routes/$caseNumber/trirals/$trialsId";
// import { Route as TriralsRouteRoute } from "./routes/$caseNumber/trirals/route";
import { Route as WitnessTestimonyRoute } from "@/routes/$caseNumber/witness-testimony";

export const DEFAULT_SECTIONS: Section[] = [
	{ title: "기일 진행", route: HearingsRouteRoute.fullPath, order: 0 },
	{
		title: "관련 법리 및 판례",
		route: PrinciplesPrecedentsRoute.fullPath,
		order: 1,
	},
	{ title: "증인 진술 요지", route: WitnessTestimonyRoute.fullPath, order: 2 },
	{ title: "기타 메모", route: NotesRoute.fullPath, order: 3 },
] as const;

export const SECTION_CATEGORIES = [
	"hearings",
	"principles-precedents",
	"witness-testimony",
	"notes",
] as const;
