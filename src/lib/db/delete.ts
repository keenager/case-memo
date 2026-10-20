import { getDB } from "./db";

export const deleteCase = async (id: string) => {
	const db = await getDB();
	const result = await db.execute("DELETE FROM cases WHERE id = $1", [id]);
	console.log(result);
};

export const deleteHearing = async (id: string) => {
	const db = await getDB();
	const result = await db.execute("DELETE FROM hearings WHERE id = $1", [id]);
	console.log(result);
};
