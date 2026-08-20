import "./App.css";
import CaseList from "./components/CaseList";
import Layout from "./components/Layout";
import type { Case } from "./lib/types";

const cases: Case[] = [
	{
		id: "1",
		caseNumber: "2023가합12345",
		caseType: "CIVIL",
		caseName: "대여금",
		court: "서울중앙지방법원",
		filedAt: new Date("2023-01-15"),
		createdAt: new Date("2023-01-10"),
	},
	{
		id: "2",
		caseNumber: "2024가합345",
		caseType: "CRIMINAL",
		caseName: "절도",
		court: "서울중앙지방법원",
		filedAt: new Date("2024-01-15"),
		createdAt: new Date("2024-01-10"),
	},
];

function App() {
	return (
		<Layout>
			<CaseList cases={cases} />
		</Layout>
	);
}

export default App;
