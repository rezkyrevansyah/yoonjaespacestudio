"use client";

import { useState, useEffect } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangeFilter } from "@/components/ui/date-range-filter";
import { BOOKING_STATUS_LABEL, PRINT_ORDER_STATUS_LABEL } from "@/lib/constants";

export const ALL_STATUSES = "ALL";
export const RESCHEDULED_FILTER = "RESCHEDULED";

interface StaffOption {
  id: string;
  name: string;
}

interface BookingFilterValues {
  statusFilter: string;
  printFilter: string;
  staffFilter: string;
  dateFrom: string;
  dateTo: string;
}

interface BookingFilterSheetProps {
  values: BookingFilterValues;
  staffOptions: StaffOption[];
  onApply: (values: BookingFilterValues) => void;
}

function countActiveFilters(v: BookingFilterValues): number {
  let count = 0;
  if (v.statusFilter !== ALL_STATUSES) count++;
  if (v.printFilter) count++;
  if (v.staffFilter) count++;
  if (v.dateFrom || v.dateTo) count++;
  return count;
}

export function BookingFilterSheet({ values, staffOptions, onApply }: BookingFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(values);

  useEffect(() => {
    if (open) setDraft(values);
  }, [open, values]);

  const activeCount = countActiveFilters(values);

  function handleApply() {
    onApply(draft);
    setOpen(false);
  }

  function handleResetDraft() {
    setDraft({ statusFilter: ALL_STATUSES, printFilter: "", staffFilter: "", dateFrom: "", dateTo: "" });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 shrink-0">
          <SlidersHorizontal className="h-4 w-4" />
          Filter
          {activeCount > 0 && (
            <Badge className="bg-maroon-700 hover:bg-maroon-700 text-white h-5 min-w-5 px-1 justify-center rounded-full">
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Lanjutan</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 mt-6">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Status Booking</label>
            <Select value={draft.statusFilter} onValueChange={(v) => setDraft((d) => ({ ...d, statusFilter: v }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES}>Semua Status</SelectItem>
                <SelectItem value={RESCHEDULED_FILTER}>Rescheduled</SelectItem>
                {Object.entries(BOOKING_STATUS_LABEL).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Status Print</label>
            <Select
              value={draft.printFilter || ALL_STATUSES}
              onValueChange={(v) => setDraft((d) => ({ ...d, printFilter: v === ALL_STATUSES ? "" : v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Print Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES}>Semua Print</SelectItem>
                {Object.entries(PRINT_ORDER_STATUS_LABEL).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Handled By</label>
            <Select
              value={draft.staffFilter || ALL_STATUSES}
              onValueChange={(v) => setDraft((d) => ({ ...d, staffFilter: v === ALL_STATUSES ? "" : v }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Staff" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_STATUSES}>Semua Staff</SelectItem>
                {staffOptions.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Rentang Tanggal Custom</label>
            <DateRangeFilter
              from={draft.dateFrom}
              to={draft.dateTo}
              className="w-full"
              onChange={(from, to) => setDraft((d) => ({ ...d, dateFrom: from, dateTo: to }))}
            />
          </div>
        </div>

        <SheetFooter className="mt-8 gap-2">
          <Button variant="ghost" onClick={handleResetDraft} className="text-gray-500">
            Reset
          </Button>
          <Button onClick={handleApply} className="bg-maroon-700 hover:bg-maroon-600 text-white">
            Terapkan Filter
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
