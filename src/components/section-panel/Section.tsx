import { Link, useParams } from "@tanstack/react-router";
import type { SectionType } from "@/lib/types";
import { Button } from "../ui/button";

export default function Section({ section }: { section: SectionType }) {
	const { caseNumber } = useParams({ strict: false });

	return (
		<Link
			to={section.route}
			params={{ caseNumber: caseNumber ?? "" }}
			key={section.order}
		>
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
