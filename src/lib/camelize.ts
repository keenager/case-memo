type SnakeToCamel<S extends string> = S extends `${infer Head}_${infer Tail}`
	? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
	: S;

export type CamelCase<T> = {
	[K in keyof T as K extends string ? SnakeToCamel<K> : K]: T[K];
};

const toCamel = (s: string) =>
	s.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());

export function camelizeKeys<Row extends object>(row: Row): CamelCase<Row> {
	return Object.fromEntries(
		Object.entries(row).map(([key, value]) => [toCamel(key), value]),
	) as CamelCase<Row>;
}

export const toSnake = (s: string) =>
	s.replace(/([A-Z])/g, (_, c: string) => `_${c.toLowerCase()}`);
