import type React from "react";

export type MemoLayoutProps = {
	caseNumber: string;
	sectionName: string;
	hearingsId?: string;
};

export default function MemoLayout({
	caseNumber,
	sectionName,
	hearingsId,
	children,
}: MemoLayoutProps & { children: React.ReactNode }) {
	return (
		<div className="flex-1 m-2 flex flex-col">
			<h1 className="text-center mb-2 items-center">
				{caseNumber} {hearingsId} {sectionName}
			</h1>
			{children}
		</div>
	);
}
