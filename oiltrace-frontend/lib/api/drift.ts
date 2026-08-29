import { API_URL } from "./detection";

export async function runHindcast(spillId: string) {
  // Mock drift hindcasting
  return {
    engine: "OpenDrift",
    originZone: {
      centerLat: 13.201,
      centerLon: 80.121
    },
    releaseWindow: "07:42–08:18 UTC"
  };
}

export async function runCounterfactual(vesselId: string, spillId: string) {
  return {
    trajectorySimilarity: 0.87,
    spatialOverlap: 0.82
  };
}
