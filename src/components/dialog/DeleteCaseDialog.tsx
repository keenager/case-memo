import { useNavigate } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import type { CaseInFront } from "@/lib/case";
import { deleteCase } from "@/lib/db/delete";
import { Button } from "../ui/button";
import { MakeAlertDialog } from "./MakeAlertDialog";

type Props = {
	selectedCase: CaseInFront;
};

export default function DeleteCaseDialog({
	selectedCase: { id: caseId, courtName, caseNumber, caseName },
}: Props) {
	const [open, setOpen] = useState(false);
	const navi = useNavigate();

	const deleteHandler = async (caseId: string) => {
		try {
			await deleteCase(caseId);
			setOpen(false);
			navi({
				to: "/",
				reloadDocument: true,
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<MakeAlertDialog
			title="기일 삭제"
			description={`${courtName} ${caseNumber} ${caseName} 사건을 삭제하시겠습니까?`}
			actionLabel="삭제"
			actionVariant="destructive"
			clickHandler={deleteHandler.bind(null, caseId)}
			open={open}
			setOpen={setOpen}
		>
			<Button variant="ghost" className="p-1">
				<Trash2Icon color="red" />
			</Button>
		</MakeAlertDialog>
	);
}
