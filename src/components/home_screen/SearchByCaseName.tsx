import { Input } from "../ui/input";

export default function SearchByCaseName({
	setSearch,
	search,
}: {
	search: string | undefined;
	setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
	console.log("search: ", search);
	return (
		<Input
			className="w-40"
			placeholder="사건명으로 검색"
			value={search ?? ""}
			onChange={(e) => setSearch(e.target.value)}
		/>
	);
}
