import { PlusIcon } from "lucide-react";
import type { SectionType } from "@/lib/types";
import { Route as HearingsRouteRoute } from "@/routes/$caseNumber/hearings/route";
import { Route as NotesRoute } from "@/routes/$caseNumber/notes";
import { Route as PrinciplesPrecedentsRoute } from "@/routes/$caseNumber/principles-precedents";
// import { Route as TriralsTrialsIdRoute } from "./routes/$caseNumber/trirals/$trialsId";
// import { Route as TriralsRouteRoute } from "./routes/$caseNumber/trirals/route";
import { Route as WitnessTestimonyRoute } from "@/routes/$caseNumber/witness-testimony";
import { Button } from "../ui/button";
import SectionItem from "./SectionItem";

const DEFAULT_SECTIONS: SectionType[] = [
	{ title: "기일 진행", route: HearingsRouteRoute.fullPath, order: 0 },
	{
		title: "관련 법리 및 판례",
		route: PrinciplesPrecedentsRoute.fullPath,
		order: 1,
	},
	{ title: "증인 진술 요지", route: WitnessTestimonyRoute.fullPath, order: 2 },
	{ title: "기타 메모", route: NotesRoute.fullPath, order: 3 },
] as const;

export default function SectionsPanel() {
	return (
		<div className="flex-1 flex flex-col">
			<p className="shrink-0 text-xs font-medium text-muted-foreground px-4 py-2 border-t">
				메모 섹션
			</p>
			<div className="flex-1 mr-2">
				{DEFAULT_SECTIONS.map((section) => (
					<SectionItem key={section.order} section={section} />
				))}
			</div>

			{/* 섹션 추가 버튼 */}
			<div className="shrink-0 p-3 border-t">
				<Button variant="outline" size="sm" className="w-full">
					<PlusIcon className="w-4 h-4 mr-2" />
					섹션 추가
				</Button>
			</div>
		</div>
	);
}
