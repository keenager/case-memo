import type { SnakeCase } from "./camelize";

export type Court = { id: number; parentId: number | null; name: string };

export type CourtForSelect = {
	label: string;
	value: number | null;
	// branch?: Omit<CourtForSelect, "branch">[];
	isBranch: boolean;
};

export const getCourtList = (courts: SnakeCase<Court>[]): CourtForSelect[] => {
	return courts.map((court) => ({
		label: court.name,
		value: court.id,
		isBranch: !!court.parent_id,
	}));
};

// export const getCourtList2 = (courts: Court[]) => {
// 	const result: CourtForSelect[] = [];
// 	courts.forEach((court) => {
// 		const data = { id: court.id, label: court.name, value: court.name };
// 		if (court.parentId) {
// 			const parentIdx = result.findIndex((item) => item.id === court.parentId);
// 			const branch = result[parentIdx].branch;
// 			if (Array.isArray(branch)) {
// 				branch.push(data);
// 			} else {
// 				result[parentIdx].branch = [data];
// 			}
// 		} else {
// 			result.push(data);
// 		}
// 	});
// 	return result;
// };
