import { ReportView } from "./report-view";

export default function ReportPage({ params }: { params: { id: string } }) {
  return <ReportView assessmentId={params.id} />;
}
