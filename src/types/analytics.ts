export type AnalyticsData = {
    farmHealthHistory: { month: string; score: number }[];
    diseaseDetections: { crop: string; detections: number }[];
    soilNutrientHistory: { month: string; nitrogen: number; phosphorus: number; potassium: number }[];
};
