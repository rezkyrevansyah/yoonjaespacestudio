const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export function getPeriodRange(month: number, year: number, cutoffDay: number): { start: string; end: string; label: string } {
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const endDay = cutoffDay - 1;
  const start = `${prevYear}-${String(prevMonth + 1).padStart(2, "0")}-${String(cutoffDay).padStart(2, "0")}`;
  const end = `${year}-${String(month + 1).padStart(2, "0")}-${String(endDay).padStart(2, "0")}`;
  const label = `${cutoffDay} ${MONTHS[prevMonth]} ${prevYear} – ${endDay} ${MONTHS[month]} ${year}`;
  return { start, end, label };
}
