import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$caseNumber/hearings/$hearingsId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$caseNumber/hearings/$hearingsId"!</div>
}
