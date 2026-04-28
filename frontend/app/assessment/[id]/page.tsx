import { Wizard } from "./wizard";

export default function AssessmentPage({
  params,
}: {
  params: { id: string };
}) {
  return <Wizard assessmentId={params.id} />;
}
