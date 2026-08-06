import type { BookingStatus } from "@/lib/types/database";

// ADDON_UNPAID is intentional: outstanding addon debt does not block revenue/commission recognition.
export const REVENUE_STATUSES: BookingStatus[] = [
  "PAID",
  "SHOOT_DONE",
  "PHOTOS_DELIVERED",
  "ADDON_UNPAID",
  "CLOSED",
];

export const VALID_BOOKING_STATUSES: BookingStatus[] = [
  "BOOKED",
  "DP_PAID",
  ...REVENUE_STATUSES,
];

export function getMonthRange(year: number, month: number): { startDate: string; endDate: string } {
  const startDate = `${year}-${String(month + 1).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month + 1, 0).getDate();
  const endDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { startDate, endDate };
}

// Canonical "which period does this booking's revenue belong to" rule.
// Revenue is recognized on transaction_date (when money actually moved), falling
// back to created_at only for legacy rows where transaction_date was never set.
// Dashboard, Finance, and Commissions must all use this — do not filter revenue
// periods by booking_date, which is the photoshoot session date, not payment date.
export function revenuePeriodFilter(startDate: string, endDate: string): string {
  return (
    `and(transaction_date.gte.${startDate},transaction_date.lte.${endDate}),` +
    `and(transaction_date.is.null,created_at.gte.${startDate}T00:00:00,created_at.lte.${endDate}T23:59:59)`
  );
}

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getWeekRange(date: Date): { startDate: string; endDate: string } {
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return { startDate: toDateStr(monday), endDate: toDateStr(sunday) };
}

export function getPreviousMonthRange(date: Date): { startDate: string; endDate: string } {
  const month = date.getMonth();
  const year = date.getFullYear();
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  return getMonthRange(prevYear, prevMonth);
}
