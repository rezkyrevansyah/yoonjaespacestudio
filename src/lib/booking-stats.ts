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
