"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatRupiah, formatDate } from "@/lib/utils";
import { BOOKING_STATUS_LABEL, BOOKING_STATUS_COLOR } from "@/lib/constants";
import type { BookingStatus } from "@/lib/types/database";
import type { IncomeBooking } from "./finance-client";

interface Props {
  open: boolean;
  onClose: () => void;
  sessionBookings: IncomeBooking[];
  incomeBookings: IncomeBooking[];
  monthLabel: string;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${BOOKING_STATUS_COLOR[status as BookingStatus] ?? ""}`}>
      {BOOKING_STATUS_LABEL[status as BookingStatus] ?? status}
    </span>
  );
}

function NoteBadge({ tone, children }: { tone: "green" | "amber"; children: React.ReactNode }) {
  const cls = tone === "green"
    ? "bg-green-50 text-green-700 border-green-100"
    : "bg-amber-50 text-amber-700 border-amber-100";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      {children}
    </span>
  );
}

function BookingRow({ booking, note }: { booking: IncomeBooking; note: React.ReactNode }) {
  return (
    <div className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {booking.customers?.name ?? "-"}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {booking.booking_number} · {booking.packages?.name ?? "-"}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <StatusBadge status={booking.status} />
        <span className="text-sm font-semibold text-gray-900 w-28 text-right">
          {formatRupiah(booking.total)}
        </span>
      </div>
      <div className="flex-shrink-0 sm:w-56 flex sm:justify-end">
        {note}
      </div>
    </div>
  );
}

export function BookingDiffDialog({ open, onClose, sessionBookings, incomeBookings, monthLabel }: Props) {
  const incomeIds = new Set(incomeBookings.map((b) => b.id));
  const sessionIds = new Set(sessionBookings.map((b) => b.id));

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Detail Selisih Booking — {monthLabel}</DialogTitle>
          <p className="text-xs text-gray-500">
            Bandingkan booking berdasarkan tanggal sesi foto vs tanggal transaksi (income).
          </p>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 pb-6 space-y-6">
          {/* Section 1: Sesi foto bulan ini */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Sesi Foto {monthLabel} <span className="text-gray-400 font-normal">({sessionBookings.length} booking)</span>
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              Booking dengan jadwal sesi foto di bulan ini.
            </p>
            <div className="rounded-lg border border-gray-100 divide-y divide-gray-50">
              {sessionBookings.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-gray-400">Tidak ada booking</p>
              ) : (
                sessionBookings.map((b) => {
                  const incomeThisMonth = incomeIds.has(b.id);
                  return (
                    <BookingRow
                      key={b.id}
                      booking={b}
                      note={
                        incomeThisMonth ? (
                          <NoteBadge tone="green">Income bulan ini</NoteBadge>
                        ) : b.transaction_date ? (
                          <NoteBadge tone="amber">
                            Income: {formatDate(b.transaction_date)}
                          </NoteBadge>
                        ) : (
                          <NoteBadge tone="amber">Belum ada transaksi tercatat</NoteBadge>
                        )
                      }
                    />
                  );
                })
              )}
            </div>
          </div>

          {/* Section 2: Income bulan ini */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Income {monthLabel} <span className="text-gray-400 font-normal">({incomeBookings.length} booking)</span>
            </h3>
            <p className="text-xs text-gray-500 mb-2">
              Booking dengan transaksi (DP/pelunasan) tercatat di bulan ini.
            </p>
            <div className="rounded-lg border border-gray-100 divide-y divide-gray-50">
              {incomeBookings.length === 0 ? (
                <p className="px-4 py-6 text-center text-sm text-gray-400">Tidak ada booking</p>
              ) : (
                incomeBookings.map((b) => {
                  const sessionThisMonth = sessionIds.has(b.id);
                  return (
                    <BookingRow
                      key={b.id}
                      booking={b}
                      note={
                        sessionThisMonth ? (
                          <NoteBadge tone="green">Sesi bulan ini</NoteBadge>
                        ) : (
                          <NoteBadge tone="amber">
                            Sesi: {formatDate(b.booking_date)}
                          </NoteBadge>
                        )
                      }
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
