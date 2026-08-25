import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/$caseNumber/notes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/notes"!</div>
}
