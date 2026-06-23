import { requireAdmin } from "@/lib/security";
import { dashboardSummaryResponse, getDashboardSummary } from "@/lib/dashboard-summary";
export async function GET() {
    const authError = await requireAdmin();
    if (authError)
        return authError;
    return dashboardSummaryResponse(await getDashboardSummary());
}
