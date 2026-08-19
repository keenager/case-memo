import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex grow flex-col mx-3">
			<h1 className="text-center text-2xl">사건 메모</h1>
			<div className="flex justify-end mb-4">
				<Button onClick={() => {}}>
					<PlusIcon className="w-4 h-4 mr-2" />새 사건
				</Button>
			</div>
			{children}
		</div>
	);
}
