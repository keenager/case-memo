import type { ReactNode } from "react";
import { Button } from "./button";

export const MenuWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<div className="z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95">
			{children}
		</div>
	);
};

export const MenuLabel = ({ children }: { children: ReactNode }) => {
	return (
		<div className="px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7">
			{children}
		</div>
	);
};

export const MenuSeparator = () => {
	return <div className="-mx-1 my-1 h-px bg-border"></div>;
};

export const MenuItem = ({
	text,
	clickHandler,
}: {
	text: string;
	clickHandler?: () => void;
}) => {
	return (
		<div className="relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive">
			<Button
				onClick={clickHandler}
				variant="ghost"
				className="h-auto w-full justify-start rounded-sm px-2 py-1.5 text-sm font-normal hover:bg-accent hover:text-accent-foreground"
			>
				{text}
			</Button>
		</div>
	);
};
