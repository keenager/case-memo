import { format } from "date-fns";

export const formattedDate = (date: Date | string): string =>
	typeof date === "string" && date.includes(".")
		? date
		: format(date, "yyyy. MM. dd.");
