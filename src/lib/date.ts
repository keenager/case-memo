import { format } from "date-fns";

export const formattedDate = (date: Date): string =>
	format(date, "yyyy. MM. dd.");
