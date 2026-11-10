export const PARTIES = [
	{ id: "plaintiff", name: "plaintiff", value: "plaintiff", label: "원고" },
	{
		id: "plaintiffLawyer",
		name: "plaintiffLawyer",
		value: "plaintiffLawyer",
		label: "원고 대리인",
	},
	{ id: "defendant", name: "defendant", value: "defendant", label: "피고" },
	{
		id: "defendantLawyer",
		name: "defendantLawyer",
		value: "defendantLawyer",
		label: "피고 대리인",
	},
] as const;

export type ResultOfUseState<T> = [T, React.Dispatch<React.SetStateAction<T>>];
