import API_BASE_URL from "@/config/api";
import type { Revenue } from "./revenue-schema";

export type RevenueResponse = {
  revenue: Revenue[];
};

export const getRevenue = async (): Promise<RevenueResponse> => {
  const res = await fetch(`${API_BASE_URL}/revenue`);

  if (!res.ok) {
    throw new Error("Error cargando ingresos");
  }

  const data: RevenueResponse = await res.json();
  const revenueList = data.revenue.sort((a, b) => a.day.localeCompare(b.day));

  return { revenue: revenueList };
};
