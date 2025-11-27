// app/agenda/components/CalendarView.tsx
"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Appointment } from "@/types/appointment";

export default function CalendarView({
  appointments,
}: {
  appointments: Appointment[];
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // --- FIX 1: safe function to convert date → yyyy-mm-dd (local) ---
  const formatLocalDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // --- FIX 2: filter appointments using LOCAL date ---
  const selectedDay = date ? formatLocalDate(date) : "";
  const filtered = appointments.filter((appt) => appt.date === selectedDay);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Calendrier</h2>

      <div className="flex justify-center mb-6">
  <Calendar
    mode="single"
    selected={date}
    onSelect={(d) => {
      // Prevent undefined clicks
      if (d) setDate(d);
    }}
    className="rounded-xl"

    // 🔥 FIX: remove highlight from today's date
    modifiersClassNames={{
      today: "!bg-transparent !text-black !font-normal border-none shadow-none",
    }}

    // 🔥 FIX: ensure only the selected date is styled
    modifiers={{
      selected: date ? [date] : [],
    }}
  />
</div>


      <h3 className="font-semibold mb-3">
        RDV du {date?.toLocaleDateString("fr-FR")}
      </h3>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Aucun rendez-vous</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((appt) => (
            <div key={appt.id} className="flex items-center gap-3 text-sm">
              <Badge>{appt.time}</Badge>
              <span>
                {appt.patient?.firstName} {appt.patient?.lastName}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
