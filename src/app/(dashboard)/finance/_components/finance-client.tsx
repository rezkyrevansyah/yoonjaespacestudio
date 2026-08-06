"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Download, ChevronDown, Package, CalendarRange, Info } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { formatRupiah, formatDate } from "@/lib/utils";
import { REVENUE_STATUSES, getMonthRange, revenuePeriodFilter } from "@/lib/booking-stats";
import type { CurrentUser, Expense } from "@/lib/types/database";
import { SummaryCards } from "./summary-cards";
import { IncomeTable } from "./income-table";
import { ExpenseTable } from "./expense-table";
import { PopularPackages } from "./popular-packages";
import { ExpenseModal } from "./expense-modal";
import { BookingDiffDialog } from "./booking-diff-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Vendor {
  id: string;
  name: string;
}

export interface IncomeBooking {
  id: string;
  booking_number: string;
  booking_date: string;
  transaction_date: string | null;
  created_at: string;
  status: string;
  total: number;
  payment_method: string | null;
  payment_account_name: string | null;
  customers: { name: string } | null;
  packages: { name: string } | null;
}

export interface PackageStat {
  package_id: string;
  package_name: string;
  booking_count: number;
  revenue: number;
}

interface Props {
  currentUser: CurrentUser;
  vendors: Vendor[];
  initialData: {
    incomeBookings: IncomeBooking[];
    expenses: Expense[];
    packageStats: PackageStat[];
    month: number;
    year: number;
    sessionBookings: IncomeBooking[];
  };
}

const supabase = createClient();

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function FinanceClient({ currentUser, vendors, initialData }: Props) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(initialData.month);
  const [selectedYear, setSelectedYear] = useState(initialData.year);
  const [viewMode, setViewMode] = useState<"month" | "all-time">("month");

  const [incomeBookings, setIncomeBookings] = useState<IncomeBooking[]>(initialData.incomeBookings);
  const [expenses, setExpenses] = useState<Expense[]>(initialData.expenses);
  const [packageStats, setPackageStats] = useState<PackageStat[]>(initialData.packageStats);
  const [sessionBookings, setSessionBookings] = useState<IncomeBooking[]>(initialData.sessionBookings);
  const [loading, setLoading] = useState(false);
  const [packageFilter, setPackageFilter] = useState<string>("all");

  const isInitialMount = useRef(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [diffDialogOpen, setDiffDialogOpen] = useState(false);

  // Year options: current year ± 2
  const yearOptions = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  const fetchData = useCallback(async () => {
    setLoading(true);

    let bookingsQuery = supabase
      .from("bookings")
      .select("id, booking_number, booking_date, transaction_date, created_at, status, total, payment_method, payment_account_name, customers(name), packages(name)")
      .in("status", REVENUE_STATUSES);
    let expensesQuery = supabase
      .from("expenses")
      .select("id, date, description, amount, category, notes, source, source_id, vendor_id, vendors(id, name)");
    let sessionBookingsQuery = viewMode === "month"
      ? supabase
          .from("bookings")
          .select("id, booking_number, booking_date, transaction_date, created_at, status, total, payment_method, payment_account_name, customers(name), packages(name)")
          .in("status", REVENUE_STATUSES)
      : null;

    if (viewMode === "month") {
      const { startDate, endDate } = getMonthRange(selectedYear, selectedMonth);
      bookingsQuery = bookingsQuery.or(revenuePeriodFilter(startDate, endDate));
      expensesQuery = expensesQuery.gte("date", startDate).lte("date", endDate);
      sessionBookingsQuery = sessionBookingsQuery!.gte("booking_date", startDate).lte("booking_date", endDate);
    }

    const [{ data: bookings }, { data: expenseData }, sessionBookingsResult] = await Promise.all([
      bookingsQuery.order("transaction_date"),
      expensesQuery.order("date"),
      sessionBookingsQuery ? sessionBookingsQuery.order("booking_date") : Promise.resolve({ data: null }),
    ]);

    setIncomeBookings((bookings ?? []) as unknown as IncomeBooking[]);
    setExpenses((expenseData ?? []) as unknown as Expense[]);
    setSessionBookings((sessionBookingsResult.data ?? []) as unknown as IncomeBooking[]);

    // Package stats from the income bookings
    const statsMap = new Map<string, PackageStat>();
    for (const b of (bookings ?? [])) {
      const booking = b as unknown as IncomeBooking;
      const pkgName = booking.packages?.name ?? "Unknown";
      // Use package name as key since we don't have package_id directly
      const key = pkgName;
      const existing = statsMap.get(key);
      if (existing) {
        existing.booking_count += 1;
        existing.revenue += booking.total;
      } else {
        statsMap.set(key, {
          package_id: key,
          package_name: pkgName,
          booking_count: 1,
          revenue: booking.total,
        });
      }
    }
    const sorted = Array.from(statsMap.values())
      .sort((a, b) => b.booking_count - a.booking_count)
      .slice(0, 5);
    setPackageStats(sorted);

    setLoading(false);
  }, [selectedMonth, selectedYear, viewMode]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fetchData();
  }, [fetchData]);

  // Unique packages for filter
  const packageOptions = Array.from(
    new Set(incomeBookings.map((b) => b.packages?.name).filter(Boolean))
  ) as string[];

  const filteredIncomeBookings = packageFilter && packageFilter !== "all"
    ? incomeBookings.filter((b) => b.packages?.name === packageFilter)
    : incomeBookings;

  const totalIncome = filteredIncomeBookings.reduce((sum, b) => sum + b.total, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const grossProfit = totalIncome - totalExpense;

  function handleAddExpense() {
    setEditingExpense(null);
    setModalOpen(true);
  }

  function handleEditExpense(expense: Expense) {
    setEditingExpense(expense);
    setModalOpen(true);
  }

  async function handleDeleteExpense(expense: Expense) {
    if (!confirm(`Hapus pengeluaran "${expense.description}"?`)) return;

    await supabase.from("expenses").delete().eq("id", expense.id);

    // Activity log
    await supabase.from("activity_log").insert({
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_role: currentUser.role_name,
      action: "DELETE",
      entity: "expenses",
      entity_id: expense.id,
      description: `Hapus pengeluaran: ${expense.description} (${formatRupiah(expense.amount)})`,
    });

    fetchData();
  }

  async function handleCloseBooking(bookingId: string) {
    if (!confirm("Tutup booking ini? Status tidak dapat dibatalkan dari halaman Finance.")) return;

    const { error } = await supabase
      .from("bookings")
      .update({ status: "CLOSED" })
      .eq("id", bookingId);

    if (error) {
      console.error("Failed to close booking:", error.message);
      return;
    }

    await supabase.from("activity_log").insert({
      user_id: currentUser.id,
      user_name: currentUser.name,
      user_role: currentUser.role_name,
      action: "UPDATE",
      entity: "bookings",
      entity_id: bookingId,
      description: `Status booking ditutup (CLOSED) dari halaman Finance`,
    });

    fetchData();
  }

  async function handleSaveExpense(data: {
    date: string;
    description: string;
    amount: number;
    category: string;
    vendor_id: string | null;
    notes: string;
  }) {
    if (editingExpense) {
      await supabase
        .from("expenses")
        .update({
          date: data.date,
          description: data.description,
          amount: data.amount,
          category: data.category || "",
          vendor_id: data.vendor_id,
          notes: data.notes || "",
        })
        .eq("id", editingExpense.id);

      await supabase.from("activity_log").insert({
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_role: currentUser.role_name,
        action: "UPDATE",
        entity: "expenses",
        entity_id: editingExpense.id,
        description: `Edit pengeluaran: ${data.description} (${formatRupiah(data.amount)})`,
      });
    } else {
      const { data: inserted } = await supabase
        .from("expenses")
        .insert({
          date: data.date,
          description: data.description,
          amount: data.amount,
          category: data.category || "",
          vendor_id: data.vendor_id,
          notes: data.notes || "",
          source: "manual",
        })
        .select("id")
        .single();

      await supabase.from("activity_log").insert({
        user_id: currentUser.id,
        user_name: currentUser.name,
        user_role: currentUser.role_name,
        action: "CREATE",
        entity: "expenses",
        entity_id: inserted?.id ?? null,
        description: `Tambah pengeluaran: ${data.description} (${formatRupiah(data.amount)})`,
      });
    }

    setModalOpen(false);
    fetchData();
  }

  function toggleViewMode() {
    setViewMode((m) => (m === "all-time" ? "month" : "all-time"));
  }

  async function handleExportExcel() {
    const XLSX = await import("xlsx");

    const periodLabel = viewMode === "all-time" ? "Semua Waktu" : `${MONTHS[selectedMonth]} ${selectedYear}`;

    // Summary sheet
    const summaryData = [
      ["Periode", periodLabel],
      ["Total Income", totalIncome],
      ["Total Expense", totalExpense],
      ["Gross Profit", grossProfit],
    ];

    // Income sheet
    const incomeRows = incomeBookings.map((b) => ({
      "Booking ID": b.booking_number,
      "Customer": b.customers?.name ?? "-",
      "Tanggal": formatDate(b.transaction_date ?? b.created_at),
      "Paket": b.packages?.name ?? "-",
      "Metode Bayar": b.payment_method ?? "-",
      "Rekening": b.payment_account_name ?? "-",
      "Status": b.status,
      "Total": b.total,
    }));

    // Expense sheet
    const expenseRows = expenses.map((e) => ({
      "Tanggal": formatDate(e.date),
      "Deskripsi": e.description,
      "Kategori": e.category ?? "-",
      "Vendor": (e.vendors as { name: string } | null | undefined)?.name ?? "-",
      "Jumlah": e.amount,
      "Sumber": e.source === "commission" ? "Auto (Komisi)" : "Manual",
      "Catatan": e.notes ?? "",
    }));

    const wb = XLSX.utils.book_new();

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    const wsIncome = XLSX.utils.json_to_sheet(incomeRows);
    XLSX.utils.book_append_sheet(wb, wsIncome, "Income");

    const wsExpense = XLSX.utils.json_to_sheet(expenseRows);
    XLSX.utils.book_append_sheet(wb, wsExpense, "Expenses");

    const fileSuffix = viewMode === "all-time" ? "semua-waktu" : `${selectedYear}_${String(selectedMonth + 1).padStart(2, "0")}`;
    XLSX.writeFile(wb, `finance_${fileSuffix}.xlsx`);
  }

  return (
    <div className="p-4 md:p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Finance</h1>
          <p className="text-sm text-gray-500">
            {viewMode === "all-time" ? "Laporan keuangan — semua waktu" : "Laporan keuangan bulanan"}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Berdasarkan tanggal transaksi, bukan tanggal sesi foto
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-2">
          {/* All-time toggle */}
          <button
            onClick={toggleViewMode}
            aria-pressed={viewMode === "all-time"}
            className={`col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start gap-2 text-sm font-medium border rounded-lg px-4 py-2 transition-colors ${
              viewMode === "all-time"
                ? "bg-maroon-700 border-maroon-700 text-white hover:bg-maroon-600"
                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
            }`}
          >
            <CalendarRange className="w-4 h-4" />
            Semua Waktu
          </button>

          {/* Month + Year filter */}
          <div className="col-span-2 grid grid-cols-2 gap-2 sm:contents">
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                disabled={viewMode === "all-time"}
                className="w-full appearance-none text-sm font-medium border border-gray-200 rounded-lg pl-4 pr-8 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {MONTHS.map((m, i) => (
                  <option key={i} value={i}>{m}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            </div>

            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                disabled={viewMode === "all-time"}
                className="w-full appearance-none text-sm font-medium border border-gray-200 rounded-lg pl-4 pr-8 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            </div>
          </div>

          <button
            onClick={handleExportExcel}
            className="col-span-2 sm:col-span-1 flex items-center justify-center sm:justify-start gap-2 text-sm font-medium border border-gray-200 rounded-lg px-4 py-2 bg-white hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4 text-gray-500" />
            <span className="text-gray-700">Export Excel</span>
          </button>
        </div>
      </div>

      {/* Package filter */}
      {packageOptions.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter Paket</span>
          </div>
          <Select value={packageFilter} onValueChange={setPackageFilter}>
            <SelectTrigger className="w-full sm:w-48 h-10 bg-white border-gray-200 hover:border-gray-300 focus:border-maroon-500 focus:ring-maroon-500/20">
              <SelectValue placeholder="Pilih paket..." />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-sm">
              <SelectItem value="all" className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                  <span className="font-medium">Semua Paket</span>
                </div>
              </SelectItem>
              {packageOptions.map((pkg) => (
                <SelectItem key={pkg} value={pkg} className="cursor-pointer hover:bg-gray-50 focus:bg-gray-50">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-maroon-500"></span>
                    <span className="font-medium">{pkg}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Selisih jumlah booking vs jumlah income, jika ada */}
      {!loading && viewMode === "month" && sessionBookings.length !== incomeBookings.length && (
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1.5">
            <p className="text-sm text-blue-800">
              <strong>{sessionBookings.length} booking</strong> punya sesi foto di {MONTHS[selectedMonth]} {selectedYear}, tapi hanya{" "}
              <strong>{incomeBookings.length} booking</strong> yang transaksinya (DP/pelunasan) tercatat di bulan yang sama —
              sisanya dibayar di bulan lain, jadi income-nya tercatat di bulan transaksi tersebut, bukan bulan sesi foto.
            </p>
            <button
              onClick={() => setDiffDialogOpen(true)}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2"
            >
              Lihat Detail Selisih
            </button>
          </div>
        </div>
      )}

      {/* Summary cards */}
      <SummaryCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        grossProfit={grossProfit}
        bookingCount={filteredIncomeBookings.length}
        sessionBookingCount={viewMode === "month" ? sessionBookings.length : null}
        loading={loading}
      />

      {/* Income from Bookings */}
      <IncomeTable bookings={filteredIncomeBookings} loading={loading} onCloseBooking={handleCloseBooking} />

      {/* Expenses */}
      <ExpenseTable
        expenses={expenses}
        loading={loading}
        onAdd={handleAddExpense}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />

      {/* Top 5 Popular Packages */}
      <PopularPackages stats={packageStats} loading={loading} />

      {/* Expense Modal */}
      <ExpenseModal
        open={modalOpen}
        expense={editingExpense}
        vendors={vendors}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveExpense}
      />

      {/* Booking diff drill-down */}
      <BookingDiffDialog
        open={diffDialogOpen}
        onClose={() => setDiffDialogOpen(false)}
        sessionBookings={sessionBookings}
        incomeBookings={incomeBookings}
        monthLabel={`${MONTHS[selectedMonth]} ${selectedYear}`}
      />
    </div>
  );
}
