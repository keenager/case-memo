import React from "react";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { FieldGroup } from "../ui/field";

export type FieldInfo = {
	name: string;
	label: string;
};

type Props = {
	title: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: (
		e?: React.BaseSyntheticEvent<object, any, any> | undefined,
	) => Promise<void | undefined>;

	children: React.ReactNode;
};

export default function MakeDialog({
	title,
	onSubmit,
	open,
	setOpen,
	children,
}: Props) {
	const [triggerButton, ...fields] = React.Children.toArray(children);
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<div className="flex justify-end mb-4">
				<DialogTrigger render={triggerButton as React.ReactElement} />
			</div>
			<DialogContent className="sm:max-w-sm">
				<form onSubmit={onSubmit}>
					<DialogHeader>
						<DialogTitle>{title}</DialogTitle>
					</DialogHeader>
					<div className="my-5 -mx-4 max-h-[50vh] overflow-y-auto px-4">
						<FieldGroup>{...fields}</FieldGroup>
					</div>
					<DialogFooter>
						<DialogClose render={<Button variant="outline">취소</Button>} />
						<Button type="submit">저장</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
