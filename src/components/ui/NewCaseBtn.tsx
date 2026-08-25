import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewCaseBtn() {
	return (
		<div className="flex justify-end mb-4">
			<Button onClick={() => {}}>
				<PlusIcon className="w-4 h-4 mr-2" />새 사건
			</Button>
		</div>
	);
}
