export async function rankVessels(candidates: any[], originData: any) {
  return [
    { name: "VESSEL ALPHA", score: 91, evidence: { spatial: 92, temporal: 88, trajectory: 86, drift: 94, anomaly: 70 } },
    { name: "VESSEL BRAVO", score: 64, evidence: {} },
    { name: "VESSEL CHARLIE", score: 38, evidence: {} },
    { name: "VESSEL DELTA", score: 21, evidence: {} }
  ];
}
