import { type ReactElement, type ReactNode, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
	title: string;
	description?: string;
	actionVariant?:
		| "link"
		| "default"
		| "outline"
		| "secondary"
		| "ghost"
		| "destructive";
	actionLabel: string;
	clickHandler: () => Promise<void>;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	children: ReactNode;
};

export function MakeAlertDialog({
	title,
	description,
	actionVariant,
	actionLabel,
	clickHandler,
	open,
	setOpen,
	children,
}: Props) {
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger render={children as ReactElement} />
			<AlertDialogContent size="sm">
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription className="whitespace-pre-wrap">
						{description}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel variant="outline">취소</AlertDialogCancel>
					<AlertDialogAction variant={actionVariant} onClick={clickHandler}>
						{actionLabel}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
