import { apiFetch } from "@/lib/api";

export interface StatsResponse {
  totalVolunteers: number;
  approvedVolunteers: number;
  totalDonors: number;
  totalDonationsAmount: number;
  publishedProgramsCount: number;
  publishedWorkCount: number;
  publishedStoriesCount: number;
  eldersHelped: number;
  aidDelivered: number;
  voluntaryHours: number;
  yearsActive: number;
}

export async function getStats(): Promise<StatsResponse> {
  return apiFetch<StatsResponse>("/api/stats");
}
