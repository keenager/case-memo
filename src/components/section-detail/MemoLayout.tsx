import { Separator } from "@base-ui/react/separator";
import type React from "react";

export type MemoLayoutProps = {
	caseNumber: string;
	sectionName: string;
	hearingId?: string;
};

export default function MemoLayout({
	caseNumber,
	sectionName,
	hearingId,
	children,
}: MemoLayoutProps & { children: React.ReactNode }) {
	return (
		<div className="flex-1 m-2 flex flex-col gap-1">
			<h1 className="flex flex-wrap items-center justify-center gap-2">
				<span>{caseNumber}</span>
				{hearingId && <span>{hearingId}차</span>}
				<span>{sectionName}</span>
			</h1>
			<Separator />
			{children}
		</div>
	);
}
