import Database from "@tauri-apps/plugin-sql";

const DATABASE_NAME = "sqlite:test.db";

let dbPromise: Promise<Database> | null = null;

export const getDB = async (): Promise<Database> => {
	if (!dbPromise) {
		const attempt = Database.load(DATABASE_NAME);
		dbPromise = attempt; // 캐시

		// 실패하면 캐시를 비워서 다음 호출 때 다시 load() 하게 함.
		// 현재 캐시된 시도일 때만 비운다 (closeDb 등으로 이미 교체된 경우 방지).
		attempt.catch(() => {
			if (dbPromise === attempt) dbPromise = null;
		});
	}
	return dbPromise;
};

export const closeDB = async (): Promise<void> => {
	if (!dbPromise) return;
	const current = dbPromise;
	dbPromise = null;
	try {
		const db = await current;
		await db.close();
	} catch {}
};
