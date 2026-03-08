import {
  getAverageFillRate,
  getBestSite,
  getBestSport,
  getForecastTomorrow,
  getMedalCountries,
  getOverviewCounts,
  getRecentSales,
  getRevenueBySport,
  getSalesOverTime,
  getTicketsRevenue,
  getTopEvents,
} from "@/repositories/adminAnalytics.repository";

export async function getAdminAnalyticsDashboard() {
  const [
    overview,
    ticketsRevenue,
    medalCountries,
    fillRate,
    salesOverTime,
    revenueBySport,
    topEvents,
    recentSales,
    forecast,
    bestSport,
    bestSite,
  ] = await Promise.all([
    getOverviewCounts(),
    getTicketsRevenue(),
    getMedalCountries(),
    getAverageFillRate(),
    getSalesOverTime(),
    getRevenueBySport(),
    getTopEvents(),
    getRecentSales(),
    getForecastTomorrow(),
    getBestSport(),
    getBestSite(),
  ]);

  return {
    overview: {
      sports: Number(overview?.sports ?? 0),
      athletes: Number(overview?.athletes ?? 0),
      epreuves: Number(overview?.epreuves ?? 0),
    },
    summary: {
      ticketsSold: Number(ticketsRevenue?.tickets_sold ?? 0),
      revenue: Number(ticketsRevenue?.revenue ?? 0),
      avgFillRate: Number(fillRate?.avg_fill_rate ?? 0),
      medalCountries: Number(medalCountries?.medal_countries ?? 0),
    },
    salesOverTime: salesOverTime ?? [],
    revenueBySport: revenueBySport ?? [],
    topEvents: topEvents ?? [],
    recentSales: recentSales ?? [],
    insights: {
      forecastTomorrow: Number(forecast?.forecast_tomorrow ?? 0),
      bestSport: bestSport ?? null,
      bestSite: bestSite ?? null,
    },
  };
}