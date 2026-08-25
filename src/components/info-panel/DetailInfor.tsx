import type { Case } from "@/lib/types";
import { Separator } from "../ui/separator";

export default function DetailInfo({ caseDetail }: { caseDetail: Case }) {
	return (
		<div className="px-4 pb-4 space-y-3 text-sm border-t pt-3">
			{/* 기본 정보 */}
			<div className="space-y-1">
				<p className="text-xs font-medium text-muted-foreground">기본 정보</p>
				<p>{caseDetail.court}</p>
				<p className="text-muted-foreground">
					{/* {format(new Date(caseDetail.filedAt), "yyyy. MM. dd.", {
								locale: ko,
							})}{" "} */}
					접수
				</p>
			</div>

			{/* 형사 당사자 */}
			{caseDetail.caseType === "CRIMINAL" && (
				<div className="space-y-3">
					{/* 검사 */}
					<p>검사</p>
					{/* {(criminalCase?.prosecutors.length ?? 0) > 0 && ( //TODO: 형사에 한정된 경우이므로 민사와 형사 분기를 나눈 뒤에 수정 필요
								<div className="space-y-1">
									<p className="text-xs font-medium text-muted-foreground">
										검사 {criminalCase?.prosecutors}
									</p>
								</div>
							)} */}
					<Separator />

					{/* 피고인 */}
					<p>피고인</p>
					{/* {defendants.length > 0 && (
								<div className="space-y-2">
									<p className="text-xs font-medium text-muted-foreground">
										피고인
									</p>
									{defendants.map((d, i) => (
										<div key={d.id} className="space-y-0.5">
											<div className="flex items-center gap-2">
												<p>{i + 1}.</p>
												<p className="font-medium">{d.name}</p>
												<p className="text-xs text-muted-foreground">
													{format(new Date(d.birthDate), "yyyy. MM. dd.", {
														locale: ko,
													})}{" "}
													생
												</p>
											</div>
											<p className="text-xs text-muted-foreground">
												{d.address}
											</p>
											{d.isDetained && (
												<Badge variant="destructive" className="text-xs">
													구속 · {d.detentionPlace}
												</Badge>
											)}
											{d.isMandatoryPublicDefense && (
												<Badge
													variant="outline"
													className="text-xs text-orange-600"
												>
													필요적 국선
												</Badge>
											)}
											<p>
												{d.privateDefender} {d.publicDefender}
											</p>
										</div>
									))}
								</div>
							)} */}
					<Separator />

					{/* 배상신청인 */}
					<p>배상신청인</p>
					{/* {(criminalCase?.compensationApplicants.length ?? 0) > 0 && ( //TODO: 형사에 한정된 경우이므로 민사와 형사 분기를 나눈 뒤에 수정 필요
								<div className="space-y-1">
									<p className="text-xs font-medium text-muted-foreground">
										배상신청인
									</p>
									{criminalCase?.compensationApplicants.map((a) => (
										<div key={a.id}>
											<p>{a.name}</p>
											<p className="text-xs text-muted-foreground">
												{a.claimAmount.toLocaleString()}원
											</p>
											<p className="text-xs text-muted-foreground">
												{a.claimReason}
											</p>
										</div>
									))}
								</div>
							)} */}
				</div>
			)}
		</div>
	);
}
