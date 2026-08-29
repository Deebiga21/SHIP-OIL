export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function detectSpill(imageFile: File) {
  // Mock detection
  return {
    id: "OIL-2026-024",
    confidence: 0.942,
    areaKm2: 4.8,
    centroid: { lat: 13.245, lon: 80.182 },
    timestamp: "2026-08-27T08:30:00Z"
  };
}

export async function getSpillDetails(spillId: string) {
  // Mock details
  return {
    id: spillId,
    area: "4.8 km²",
    perimeter: "13.2 km",
    modelUsed: "U-Net + ResNet"
  };
}
