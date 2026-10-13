import { PlusIcon } from "lucide-react";
import { SECTION_CATEGORIES, SECTIONS } from "@/lib/sections";
import { Button } from "../ui/button";
import SectionItem from "./SectionItem";

export default function SectionsPanel() {
	return (
		<div className="flex-1 flex flex-col">
			<p className="shrink-0 text-xs font-medium text-muted-foreground px-4 py-2 border-t">
				메모 섹션
			</p>
			<div className="flex-1 mr-2">
				{SECTION_CATEGORIES.map((section) => (
					<SectionItem key={section} section={SECTIONS[section]} />
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
