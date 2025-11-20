import axios from "axios";
import type { AlgorithmRequest, AlgorithmResponse } from "../types/graph";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function runAlgorithm(req: AlgorithmRequest): Promise<AlgorithmResponse> {
  const res = await api.post<AlgorithmResponse>("/api/graph/run", req);
  return res.data;
}
