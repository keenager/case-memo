import { useNavigate } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formattedDate } from "@/lib/date";
import { deleteHearing } from "@/lib/db/delete";
import type { HearingInList } from "@/lib/hearing";
import { MakeAlertDialog } from "./MakeAlertDialog";

type Props = {
	caseId: string;
	targetHearing: HearingInList;
	updateList: React.Dispatch<React.SetStateAction<HearingInList[]>>;
};

export default function DeleteHearingDialog({
	caseId,
	targetHearing: { id: hearingId, hearingDate, hearingTime },
	updateList,
}: Props) {
	const [open, setOpen] = useState(false);
	const navi = useNavigate();

	const deleteHandler = async (hearingId: string) => {
		try {
			await deleteHearing(hearingId);
			updateList((prev) => prev.filter((h) => h.id !== hearingId));
			setOpen(false);
			navi({
				to: "/$caseId/hearings",
				params: { caseId },
				// reloadDocument: true,
			});
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<MakeAlertDialog
			title="기일 삭제"
			description={`${formattedDate(hearingDate)} ${hearingTime} \n위 기일 정보를 삭제하시겠습니까?`}
			actionLabel="삭제"
			actionVariant="destructive"
			clickHandler={deleteHandler.bind(null, hearingId)}
			open={open}
			setOpen={setOpen}
		>
			<Button variant="ghost" className="p-1">
				<Trash2Icon color="red" />
			</Button>
		</MakeAlertDialog>
	);
}
