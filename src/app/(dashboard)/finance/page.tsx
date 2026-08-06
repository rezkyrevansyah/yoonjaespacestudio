import { requireMenu } from "@/lib/require-menu";
import { getCachedActiveVendors } from "@/lib/cached-queries";
import { REVENUE_STATUSES, getMonthRange, revenuePeriodFilter } from "@/lib/booking-stats";
import { createClient } from "@/utils/supabase/server";
import { FinanceClient, type IncomeBooking, type PackageStat } from "./_components/finance-client";
import type { Expense } from "@/lib/types/database";

export const metadata = { title: "Finance — Yoonjaespace" };
export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const supabase = await createClient();
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const { startDate, endDate } = getMonthRange(year, month);

  const [currentUser, vendors, bookingsResult, expensesResult, sessionCountResult] = await Promise.all([
    requireMenu("finance"),
    getCachedActiveVendors(),
    supabase
      .from("bookings")
      .select("id, booking_number, booking_date, transaction_date, created_at, status, total, payment_method, payment_account_name, customers(name), packages(name)")
      .or(revenuePeriodFilter(startDate, endDate))
      .in("status", REVENUE_STATUSES)
      .order("transaction_date"),
    supabase
      .from("expenses")
      .select("id, date, description, amount, category, notes, source, source_id, vendor_id, vendors(id, name)")
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date"),
    // Booking count by session date (booking_date) — compared against income booking count
    // (by transaction_date) so the UI can explain why the two numbers differ.
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .gte("booking_date", startDate)
      .lte("booking_date", endDate)
      .in("status", REVENUE_STATUSES),
  ]);

  const incomeBookings = (bookingsResult.data ?? []) as unknown as IncomeBooking[];
  const expenses = (expensesResult.data ?? []) as unknown as Expense[];
  const sessionBookingCount = sessionCountResult.count ?? 0;

  // Compute package stats server-side
  const statsMap = new Map<string, PackageStat>();
  for (const b of incomeBookings) {
    const pkgName = b.packages?.name ?? "Unknown";
    const existing = statsMap.get(pkgName);
    if (existing) {
      existing.booking_count += 1;
      existing.revenue += b.total;
    } else {
      statsMap.set(pkgName, { package_id: pkgName, package_name: pkgName, booking_count: 1, revenue: b.total });
    }
  }
  const packageStats: PackageStat[] = Array.from(statsMap.values())
    .sort((a, b) => b.booking_count - a.booking_count)
    .slice(0, 5);

  return (
    <FinanceClient
      currentUser={currentUser}
      vendors={vendors ?? []}
      initialData={{ incomeBookings, expenses, packageStats, month, year, sessionBookingCount }}
    />
  );
}
