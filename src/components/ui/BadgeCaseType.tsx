import { CASE_TYPE } from "@/lib/case";
import { Badge } from "./badge";

export default function BadgeCaseType({
	caseType,
}: {
	caseType: (typeof CASE_TYPE)[number]["value"];
}) {
	const color =
		caseType === "criminal"
			? "bg-red-100 text-red-700"
			: "bg-blue-100 text-blue-700";

	return (
		<Badge className={color}>
			{CASE_TYPE.find((t) => t.value === caseType)?.label}
		</Badge>
	);
}
