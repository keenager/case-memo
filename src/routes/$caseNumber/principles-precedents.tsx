import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$caseNumber/principles-precedents')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/$caseNumber/principles-precedents"!</div>
}
