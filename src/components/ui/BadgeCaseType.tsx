import { Badge } from "./badge";

const caseTypeLabel = {
	CIVIL: "민사",
	CRIMINAL: "형사",
};

export default function BadgeCaseType({
	caseType,
}: {
	caseType: "CIVIL" | "CRIMINAL";
}) {
	const color =
		caseType === "CRIMINAL"
			? "bg-red-100 text-red-700"
			: "bg-blue-100 text-blue-700";

	return <Badge className={color}>{caseTypeLabel[caseType]}</Badge>;
}
