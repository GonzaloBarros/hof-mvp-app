import { SkinAnalysisResponse } from "../services/skinAnalyzer";

export interface Analysis extends SkinAnalysisResponse {
  id: string;
  patientId: string;
  createdAt: string;
  image: string;
}
