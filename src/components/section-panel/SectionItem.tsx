import { Link, useParams } from "@tanstack/react-router";
import type { Section } from "@/lib/sections";
import { Button } from "../ui/button";

export default function SectionItem({ section }: { section: Section }) {
	const { caseNumber } = useParams({ strict: false });

	return (
		<Link to={section.route} params={{ caseNumber: caseNumber ?? "" }}>
			<Button
				// onClick={() => setSelectedSectionId(s.id)}
				className={`w-full text-left px-4 py-2 text-sm transition-colors ${
					"bg-primary text-primary-foreground"
					// selectedSectionId === s.id
					// 	? "bg-primary text-primary-foreground"
					// 	: "hover:bg-muted"
				}`}
			>
				{section.title}
			</Button>
		</Link>
	);
}
