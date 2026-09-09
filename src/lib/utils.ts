import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Case } from "./types";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function snakeToCamel(c: any[]): Case[] {
	return c.map((item) => ({
		id: item.id,
		courtName: item.court_name,
		caseType: item.case_type,
		caseNumber: item.case_number,
		caseName: item.case_name,
		filedAt: item.filed_at,
		plaintiff: item.plaintiff,
		plaintiffLawyer: item.plaintiff_lawyer,
		defendant: item.defendant,
		defendantLawyer: item.defendant_lawyer,
	}));
}
