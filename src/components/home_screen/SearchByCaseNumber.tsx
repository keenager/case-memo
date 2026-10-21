import { Input } from "../ui/input";

export default function SearchByCaseNumber({
	setSearch,
	search,
}: {
	search: string | undefined;
	setSearch: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
	return (
		<Input
			className="w-40"
			placeholder="사건번호로 검색"
			value={search ?? ""}
			onChange={(e) => setSearch(e.target.value)}
		/>
	);
}
