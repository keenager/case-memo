// import { format } from "date-fns";

// export const formattedDate = (date: Date | string): string =>
// 	typeof date === "string" && date.includes(".")
// 		? date
// 		: format(date, "yyyy. MM. dd.");

export const formattedDate = (dateOrigin: Date | string): string => {
	const date: Record<string, string | number> = {};
	if (typeof dateOrigin === "string") {
		const slice = dateOrigin.split("T")[0];
		date.year = slice.split("-")[0];
		date.month = slice.split("-")[1];
		date.date = slice.split("-")[2];
	} else {
		date.year = dateOrigin.getFullYear();
		date.month = dateOrigin.getMonth() + 1;
		date.date = dateOrigin.getDate();
	}

	return `${date.year}. ${date.month}. ${date.date}`;
};

export const strToDate = (str: string): Date => {
	const date = str.split("T")[0].split("-");
	return new Date(+date[0], +date[1] - 1, +date[2]);
};
