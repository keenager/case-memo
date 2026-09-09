import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewCaseBtn() {
	return (
		<Button>
			<PlusIcon className="w-4 h-4 mr-2" />새 사건
		</Button>
	);
}
