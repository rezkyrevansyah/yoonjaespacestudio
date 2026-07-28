"use client"

import * as React from "react"
import { format, parseISO } from "date-fns"
import { id } from "date-fns/locale"
import { CalendarCheck, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DateRangeFilterProps {
  from: string
  to: string
  onChange: (from: string, to: string) => void
  placeholder?: string
  className?: string
}

type Step = "year" | "month" | "day"
type Target = "from" | "to"

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
]
const YEARS_PER_PAGE = 12

function toDate(value: string): Date | undefined {
  return value ? parseISO(value) : undefined
}

function toStr(date: Date | undefined): string {
  return date ? format(date, "yyyy-MM-dd") : ""
}

function formatLabel(from: string, to: string, placeholder: string): string {
  if (!from && !to) return placeholder
  const fromDate = toDate(from)
  const toDateVal = toDate(to)
  if (fromDate && toDateVal) {
    const sameYear = fromDate.getFullYear() === toDateVal.getFullYear()
    const fromLabel = format(fromDate, sameYear ? "d MMM" : "d MMM yyyy", { locale: id })
    const toLabel = format(toDateVal, "d MMM yyyy", { locale: id })
    return `${fromLabel} – ${toLabel}`
  }
  if (fromDate) return format(fromDate, "d MMM yyyy", { locale: id })
  return placeholder
}

function DateRangeFilter({
  from,
  to,
  onChange,
  placeholder = "Pilih Tanggal",
  className,
}: DateRangeFilterProps) {
  const [open, setOpen] = React.useState(false)
  const [target, setTarget] = React.useState<Target>("from")
  const [step, setStep] = React.useState<Step>("year")
  const [viewYear, setViewYear] = React.useState(() => new Date().getFullYear())
  const [viewMonth, setViewMonth] = React.useState(0)
  const [draftFrom, setDraftFrom] = React.useState<Date | undefined>(() => toDate(from))
  const [draftTo, setDraftTo] = React.useState<Date | undefined>(() => toDate(to))

  function resetToStart() {
    const startDate = toDate(from)
    setTarget("from")
    setStep("year")
    setViewYear(startDate?.getFullYear() ?? new Date().getFullYear())
  }

  function handleOpenChange(next: boolean) {
    if (next) {
      setDraftFrom(toDate(from))
      setDraftTo(toDate(to))
      resetToStart()
    }
    setOpen(next)
  }

  function handleApply() {
    onChange(toStr(draftFrom), toStr(draftTo))
    setOpen(false)
  }

  function handleCancel() {
    setDraftFrom(toDate(from))
    setDraftTo(toDate(to))
    setOpen(false)
  }

  function handlePickYear(year: number) {
    setViewYear(year)
    setStep("month")
  }

  function handlePickMonth(monthIndex: number) {
    setViewMonth(monthIndex)
    setStep("day")
  }

  function handlePickDay(date: Date | undefined) {
    if (!date) return
    if (target === "from") {
      setDraftFrom(date)
      setDraftTo(undefined)
      setTarget("to")
      setStep("year")
      setViewYear(date.getFullYear())
    } else {
      if (draftFrom && date < draftFrom) return
      setDraftTo(date)
    }
  }

  const yearPageStart = Math.floor(viewYear / YEARS_PER_PAGE) * YEARS_PER_PAGE
  const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i)

  const canApply = !!draftFrom && !!draftTo

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label="Filter rentang tanggal"
          className={cn("w-full sm:w-auto justify-start gap-2 font-normal", className)}
        >
          <CalendarCheck className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="truncate">{formatLabel(from, to, placeholder)}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[336px] max-w-[calc(100vw-2rem)] p-4" align="start">
        <div className="flex items-center justify-between text-xs text-gray-500 pb-3 mb-3 border-b">
          <span>
            Dari <span className="block font-medium text-gray-700 text-sm">{draftFrom ? format(draftFrom, "d MMM yyyy", { locale: id }) : "—"}</span>
          </span>
          <span className="text-right">
            Sampai <span className="block font-medium text-gray-700 text-sm">{draftTo ? format(draftTo, "d MMM yyyy", { locale: id }) : "—"}</span>
          </span>
        </div>

        {step === "year" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewYear((y) => y - YEARS_PER_PAGE)}
                aria-label="Tahun sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Pilih Tahun — {target === "from" ? "Dari" : "Sampai"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setViewYear((y) => y + YEARS_PER_PAGE)}
                aria-label="Tahun berikutnya"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {years.map((year) => (
                <Button
                  key={year}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-9 font-normal",
                    year === viewYear && "bg-maroon-700 text-white hover:bg-maroon-600 hover:text-white"
                  )}
                  onClick={() => handlePickYear(year)}
                >
                  {year}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === "month" && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setStep("year")}
                aria-label="Kembali ke pilih tahun"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Pilih Bulan — {viewYear}
              </span>
              <div className="h-8 w-8" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {MONTH_LABELS.map((label, index) => (
                <Button
                  key={label}
                  variant="ghost"
                  size="sm"
                  className="h-9 font-normal"
                  onClick={() => handlePickMonth(index)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === "day" && (
          <div>
            <div className="flex items-center justify-between mb-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setStep("month")}
                aria-label="Kembali ke pilih bulan"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {target === "from" ? "Pilih Tanggal — Dari" : "Pilih Tanggal — Sampai"}
              </span>
              <div className="h-8 w-8" />
            </div>
            <Calendar
              mode="single"
              captionLayout="label"
              hideNavigation
              month={new Date(viewYear, viewMonth)}
              onMonthChange={(date) => {
                setViewYear(date.getFullYear())
                setViewMonth(date.getMonth())
              }}
              selected={target === "from" ? draftFrom : draftTo}
              onSelect={handlePickDay}
              disabled={target === "to" && draftFrom ? { before: draftFrom } : undefined}
              className="p-0 mx-auto w-fit"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t">
          <Button variant="ghost" size="sm" onClick={handleCancel}>
            Batal
          </Button>
          <Button
            size="sm"
            disabled={!canApply}
            className="bg-maroon-700 hover:bg-maroon-600 text-white disabled:opacity-50"
            onClick={handleApply}
          >
            Terapkan
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DateRangeFilter }
