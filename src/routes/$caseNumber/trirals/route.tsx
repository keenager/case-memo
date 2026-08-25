import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$caseNumber/trirals')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$caseNumber/trirals"!</div>
}
