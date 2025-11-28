// app/doctor-dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell, RefreshCw, FileText, Calendar } from 'lucide-react';
import { appointmentService } from '@/services/appointmentService';
import { Appointment, AppointmentStatus } from '@/types/appointment';

function DoctorDashboardContent() {
  const { user } = useAuth();
  const [doctorPending, setDoctorPending] = useState<Appointment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      if (!user?.id) return;

      // Load all appointments for this doctor
      const doctorAppointments = await appointmentService.getDoctorAppointments(user.id);
      setAppointments(doctorAppointments);

      // Pending notifications
      const pendingForDoctor = doctorAppointments.filter(
        (apt) => apt.status === AppointmentStatus.PENDING
      );
      setDoctorPending(pendingForDoctor);
      
    } catch (err) {
      console.error("Error loading doctor dashboard:", err);
      setAppointments([]);
      setDoctorPending([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getStatusBadge = (status: AppointmentStatus | string) => {
  const config = {
    PENDING: { label: "En attente", variant: "secondary" },
    CONFIRMED: { label: "Confirmé", variant: "default" },
    CANCELLED: { label: "Annulé", variant: "destructive" },
    COMPLETED: { label: "Terminé", variant: "outline" },
  } as const; //  <-- IMPORTANT FIX

  const key = status.toUpperCase() as keyof typeof config;
  const st = config[key];

  return <Badge variant={st.variant}>{st.label}</Badge>;
};



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bonjour, Dr. {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600">Tableau de bord</p>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center space-x-3">

              {/* Notification */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="relative cursor-pointer p-2 rounded-full hover:bg-gray-100">
                    <Bell className="w-6 h-6 text-gray-700" />
                    {doctorPending.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {doctorPending.length}
                      </span>
                    )}
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-80">
                  <p className="p-2 font-medium border-b">Notifications</p>

                  {doctorPending.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">
                      Aucun nouveau rendez-vous.
                    </p>
                  ) : (
                    doctorPending.map((appt) => (
                      <DropdownMenuItem
                        key={appt.id}
                        className="flex flex-col items-start space-y-1"
                      >
                        <span className="font-semibold text-sm">
                          Nouveau RDV — {appt.patient?.firstName} {appt.patient?.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          📅 {appt.date} — ⏰ {appt.time}
                        </span>
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Refresh */}
              <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Actualiser
              </Button>

              {/* New prescription */}
              <Button asChild variant="outline">
                <Link href="/prescriptions/new">
                  <FileText className="w-4 h-4 mr-2" />
                  Nouvelle ordonnance
                </Link>
              </Button>

              {/* See all appointments */}
              <Button asChild>
                <Link href="/doctor-dashboard/appointments">
                  <Calendar className="w-4 h-4 mr-2" />
                  Voir tous les RDV
                </Link>
              </Button>

            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ⭐ CARD SHOWING ALL APPOINTMENTS */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              📅 Tous les rendez-vous
              <Badge className="ml-2">{appointments.length}</Badge>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {appointments.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                Aucun rendez-vous trouvé.
              </p>
            ) : (
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 border rounded-lg bg-white shadow-sm hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">
                        {apt.patient?.firstName} {apt.patient?.lastName}
                      </p>
                      {getStatusBadge(apt.status)}
                    </div>

                    <p className="text-sm text-gray-600">
                      📅 {apt.date} — ⏰ {apt.time}
                    </p>

                    <p className="text-sm mt-1 text-gray-700">
                      Motif : {apt.reason}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </main>
    </div>
  );
}

export default function DoctorDashboardPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.DOCTOR]}>
      <DoctorDashboardContent />
    </RoleGuard>
  );
}
