"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Appointment } from "@/types/appointment";

interface AppointmentListProps {
  appointments: Appointment[];
  onDelete: (id: string) => void;
  onEdit: (appt: Appointment) => void;
}

// 🎨 Best practice: centralize status colors
const statusColors: Record<string, string> = {
  confirmed: "bg-green-500 text-white",
  pending: "bg-yellow-500 text-black",
  cancelled: "bg-red-500 text-white",
  completed: "bg-blue-500 text-white",
};

export default function AppointmentList({ appointments, onDelete, onEdit }: AppointmentListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Liste des rendez-vous ({appointments.length})</h2>

      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <p className="text-gray-500">Aucun rendez-vous</p>
        </div>
      ) : (
        <AnimatePresence>
          {appointments.map((appt) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold">
                    {appt.patient?.firstName} {appt.patient?.lastName}
                  </h3>

                  <p className="text-sm text-gray-500">{appt.patient?.email}</p>

                  <p className="text-sm text-gray-500">{appt.patient?.phone}</p>

                  <p className="mt-3 text-sm">
                    📅 {appt.date} — ⏰ {appt.time}
                  </p>

                  {/* 🎨 Dynamic badge color */}
                  <Badge className={`mt-2 ${statusColors[appt.status] || "bg-gray-400 text-white"}`}>
                    {appt.status}
                  </Badge>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline" onClick={() => onEdit(appt)}>
                    Modifier
                  </Button>

                  <Button size="sm" variant="destructive" onClick={() => onDelete(appt.id)}>
                    Supprimer
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
