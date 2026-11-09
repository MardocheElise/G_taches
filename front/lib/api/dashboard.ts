import { apiClient } from "@/lib/api-client";
import { DashboardData } from "@/types/dashboard";

export const dashboardApi = {
  getDashboard: (token: string) =>
    apiClient<DashboardData>("/dashboard", {
      method: "GET",
      token,
    }),
};
