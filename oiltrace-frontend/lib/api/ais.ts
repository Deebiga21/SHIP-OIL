export async function getAISCandidates(lat: number, lon: number, timeWindow: string) {
  return [
    { mmsi: "123456789", name: "VESSEL ALPHA", status: "GAP_DETECTED" },
    { mmsi: "987654321", name: "VESSEL BRAVO", status: "ACTIVE" },
    { mmsi: "456123789", name: "VESSEL CHARLIE", status: "ACTIVE" },
    { mmsi: "789123456", name: "VESSEL DELTA", status: "ACTIVE" }
  ];
}
