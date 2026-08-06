import { requireMenu } from "@/lib/require-menu";
import { getCachedActiveUsers } from "@/lib/cached-queries";
import { REVENUE_STATUSES, revenuePeriodFilter } from "@/lib/booking-stats";
import { getPeriodRange } from "@/lib/commission-period";
import { createClient } from "@/utils/supabase/server";
import { CommissionsClient, type InitialCommissionData } from "./_components/commissions-client";

export const metadata = { title: "Commissions — Yoonjaespace" };
export const dynamic = "force-dynamic";

export default async function CommissionsPage() {
  const supabase = await createClient();
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  // Fetch cutoff day from settings
  const { data: settings } = await supabase
    .from("settings_general")
    .select("commission_cutoff_day, commission_default_bonus")
    .eq("lock", true)
    .maybeSingle();
  const cutoffDay = settings?.commission_cutoff_day ?? 26;
  const defaultBonus = settings?.commission_default_bonus ?? 0;

  const period = getPeriodRange(month, year, cutoffDay);

  const [currentUser, staffUsers, bookingsResult, commissionsResult, packagesResult] = await Promise.all([
    requireMenu("commissions"),
    getCachedActiveUsers(),
    supabase
      .from("bookings")
      .select("id, booking_number, booking_date, transaction_date, created_at, total, staff_id, commission_amount, customers(name), packages(id, name, commission_bonus)")
      .or(revenuePeriodFilter(period.start, period.end))
      .in("status", REVENUE_STATUSES)
      .order("transaction_date"),
    supabase
      .from("commissions")
      .select("id, staff_id, total_amount, status")
      .eq("period_start", period.start)
      .eq("period_end", period.end),
    supabase
      .from("packages")
      .select("id, name, commission_bonus")
      .eq("is_active", true)
      .order("sort_order")
      .order("name"),
  ]);

  const initialData: InitialCommissionData = {
    month,
    year,
    cutoffDay,
    defaultBonus,
    packages: (packagesResult.data ?? []) as { id: string; name: string; commission_bonus: number }[],
    bookings: (bookingsResult.data ?? []) as unknown as InitialCommissionData["bookings"],
    existingCommissions: (commissionsResult.data ?? []) as unknown as InitialCommissionData["existingCommissions"],
  };

  return (
    <CommissionsClient
      currentUser={currentUser}
      staffUsers={staffUsers ?? []}
      initialData={initialData}
    />
  );
}
