# OILTRACE AI: Intelligent Marine Oil Spill Detection & Vessel Attribution

## 1. Executive Summary & Elevator Pitch

### Elevator Pitch (60 Seconds)
"Every year, untraceable marine oil spills devastate our oceans, costing millions in ecological damage and cleanup while the responsible vessels slip away. The problem? Detecting spills early and proving exactly who did it is a massive data challenge, often relying on slow, manual guess-work. 

Enter **OILTRACE AI**. We've built an end-to-end, physics-aware AI platform that takes the guesswork out of marine monitoring. By ingesting Sentinel-1 SAR imagery into our precision U-Net segmentation model, we detect spills instantly. But we don't stop there. Our Spatial-Temporal Hindcasting Engine calculates wind and ocean currents to trace the spill backward in time, intersecting it with historical AIS trajectory data. 

The result? An intuitive GIS dashboard that hands authorities an actionable, explainable vessel attribution score. OILTRACE AI isn't just about finding the spill; it's about holding polluters accountable—instantly, automatically, and definitively."

### Executive Summary
* **Problem:** Deliberate and accidental marine oil spills are difficult to detect early and even harder to attribute to a specific responsible vessel.
* **AI Model:** Sentinel-1 SAR imagery processed through a U-Net architecture for high-precision spill segmentation.
* **Physics-Aware Analytics:** Ocean current and wind hindcasting (drift analysis) combined with historical AIS trajectory tracking.
* **Differentiator:** Replaces slow manual inspections with an end-to-end platform that outputs an intuitive GIS-backed vessel attribution score, eliminating guess-work.

---

## 2. Solution Architecture: End-to-End Framework

**Role:** Lead AI & Remote Sensing Solutions Architect  
**Event:** Smart India Hackathon 2026

Welcome to the architectural overview of **OILTRACE AI**. Our system is built on four primary workflow pillars designed to seamlessly bridge the gap between orbital data and actionable maritime law enforcement.

### Pillar 1: Data Acquisition & Preprocessing
*   **The Challenge:** Satellite imagery is inherently noisy and affected by sea state (waves, wind).
*   **Our Approach:** We utilize Sentinel-1 Synthetic Aperture Radar (SAR) imagery, which cuts through clouds and operates day or night. 
*   **Technical Highlights:** 
    *   **Speckle Noise Reduction:** Applying Lee or Refined Lee filters to smooth the radar speckle while preserving edges.
    *   **Radiometric Calibration & Normalization:** Converting raw digital numbers into radar backscatter (Sigma Nought) for consistent neural network ingestion.
*   **Component Responsibility:** Ensure high-fidelity, standardized input data to minimize false positives from "look-alikes" like algal blooms or wind slicks.

### Pillar 2: Extraction & Feature Analysis
*   **The Challenge:** Identifying exact spill boundaries from vast oceans of pixels.
*   **Our Approach:** A deep learning semantic segmentation engine powered by a standard U-Net architecture.
*   **Technical Highlights:**
    *   **U-Net Segmentation:** The encoder-decoder structure with skip connections perfectly captures both the spatial context (where is the spill?) and the precise pixel-level boundaries (what is its exact shape?).
    *   **Geometric Parameter Extraction:** Once segmented, the system calculates the surface area, perimeter, and the slick's center of mass.
*   **Component Responsibility:** Deliver an accurate, binary mask of the oil slick and compute its fundamental physical properties.

### Pillar 3: Attribution Logic (Spatial-Temporal Fusion & Drift-Aware Logic)
*   **The Challenge:** An oil slick drifts. The vessel that caused it is long gone. How do we connect them?
*   **Our Approach:** A physics-aware hindcasting engine combined with maritime traffic data.
*   **Technical Highlights:**
    *   **Oceanographic Integration:** We ingest real-time and historical wind patterns (v_wind) and ocean currents (v_water).
    *   **Hindcast Modeling:** We run a reverse-drift particle simulation from the slick's center to determine its exact point and time of origin.
    *   **AIS Track Matching:** We query our Automatic Identification System (AIS) database to find vessel trajectories that intersect with this computed origin bounding box during the specific time window.
*   **Component Responsibility:** Fuse environmental physics with maritime tracking to mathematically isolate the source.

### Pillar 4: Output & Explainability
*   **The Challenge:** Complex AI models are often "black boxes," making their outputs hard to use in legal or enforcement contexts.
*   **Our Approach:** An interactive GIS interface that prioritizes transparency and actionable intelligence.
*   **Technical Highlights:**
    *   **Interactive GIS Dashboard:** Visualizing the SAR imagery, segmented slick, drift trajectory, and intersecting vessel tracks on a unified map.
    *   **Explainable Attribution Score:** We generate a ranked list of suspect vessels. The score is explainable, showing exactly how much weight was given to the AIS intersection, drift confidence, and proximity.
*   **Differentiators:** Eliminates manual cross-referencing and provides undeniable, data-backed evidence for authorities.
