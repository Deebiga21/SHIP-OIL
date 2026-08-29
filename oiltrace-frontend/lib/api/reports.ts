export async function generateReport(incidentId: string) {
  return {
    reportId: `REP-${incidentId}`,
    generatedAt: new Date().toISOString(),
    status: "READY",
    summary: "AI-generated analytical summary — requires human verification.",
    content: "MARITIME POLLUTION INCIDENT REPORT..."
  };
}
