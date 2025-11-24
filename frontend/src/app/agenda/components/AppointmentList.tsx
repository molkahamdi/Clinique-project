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

export default function AppointmentList({ appointments, onDelete, onEdit }: AppointmentListProps) {
  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "Urgence": return "destructive";
      case "Consultation": return "default";
      case "Suivi": return "secondary";
      case "Bilan": return "outline";
      default: return "default";
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Liste des rendez-vous ({appointments.length})
      </h2>
      
      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <p className="text-gray-500 dark:text-gray-400 text-lg">Aucun rendez-vous trouvé</p>
          <p className="text-sm text-gray-400 mt-2">Créez votre premier rendez-vous</p>
        </div>
      ) : (
        <AnimatePresence>
          {appointments.map((appt) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {appt.patient}
                    </h3>
                    <Badge variant={getBadgeVariant(appt.type)} className="text-xs">
                      {appt.type}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {new Date(appt.date).toLocaleDateString("fr-FR", {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>
                        {new Date(appt.date).toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    {appt.dob && (
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        <span>Né(e) le {new Date(appt.dob).toLocaleDateString("fr-FR")}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <PhoneIcon className="w-4 h-4" />
                      <span>{appt.phone}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <p className="text-gray-600 dark:text-gray-400">{appt.email}</p>
                    <p className="text-gray-500 dark:text-gray-500">{appt.address}</p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEdit(appt)}
                    className="whitespace-nowrap"
                  >
                    Modifier
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => onDelete(appt.id)}
                  >
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

// Icônes simples
const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);