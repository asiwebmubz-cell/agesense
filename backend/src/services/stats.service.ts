/**
 * Stats Service
 *
 * Provides real database query aggregations for stats and metrics.
 */

import { db } from '../database';

export interface StatsResponse {
  totalVolunteers: number;
  approvedVolunteers: number;
  totalDonors: number;
  totalDonationsAmount: number;
  publishedProgramsCount: number;
  publishedWorkCount: number;
  publishedStoriesCount: number;
}

export const statsService = {
  async getMetrics(): Promise<StatsResponse> {
    const volunteersResult = await db.query('SELECT COUNT(*)::int as total, COUNT(*) FILTER (WHERE status = \'Approved\')::int as approved FROM volunteers');
    const donorsResult = await db.query('SELECT COUNT(*)::int as total, COALESCE(SUM(amount), 0)::float as amount FROM donors WHERE payment_status = \'Completed\'');
    const programsResult = await db.query('SELECT COUNT(*) FILTER (WHERE type = \'Our Programs\' AND status = \'Published\')::int as programs, COUNT(*) FILTER (WHERE type = \'Our Work\' AND status = \'Published\')::int as work, COUNT(*) FILTER (WHERE type = \'Impact Stories\' AND status = \'Published\')::int as stories FROM programs');

    return {
      totalVolunteers: volunteersResult[0]?.total || 0,
      approvedVolunteers: volunteersResult[0]?.approved || 0,
      totalDonors: donorsResult[0]?.total || 0,
      totalDonationsAmount: donorsResult[0]?.amount || 0,
      publishedProgramsCount: programsResult[0]?.programs || 0,
      publishedWorkCount: programsResult[0]?.work || 0,
      publishedStoriesCount: programsResult[0]?.stories || 0,
    };
  }
};
