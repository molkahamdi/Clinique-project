"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import RoleGuard from "@/components/guards/RoleGuard";
import { UserRole } from "@/types/auth";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { RefreshCw, FileText, Calendar, LogOut } from "lucide-react";

import { appointmentService } from "@/services/appointmentService";
import { Appointment, AppointmentStatus } from "@/types/appointment";

function DoctorDashboardContent() {
  const { user } = useAuth();

  const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;

      // Fetch doctor appointments
      const doctorAppointments = await appointmentService.getDoctorAppointments(user.id);
      setAppointments(doctorAppointments);

      // Pending appointments
      const pending = doctorAppointments.filter((apt) => apt.status === AppointmentStatus.PENDING);
      setPendingAppointments(pending);

    } catch (err) {
      console.error("Error loading doctor dashboard:", err);
      setAppointments([]);
      setPendingAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  // Render badge component
  const getStatusBadge = (status: AppointmentStatus | string) => {
    const config = {
      PENDING: { label: "En attente", variant: "secondary" },
      CONFIRMED: { label: "Confirmé", variant: "default" },
      CANCELLED: { label: "Annulé", variant: "destructive" },
      COMPLETED: { label: "Terminé", variant: "outline" },
    } as const;

    const key = status.toUpperCase() as keyof typeof config;
    return <Badge variant={config[key].variant}>{config[key].label}</Badge>;
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

            <div className="flex items-center space-x-3 bg">
              <Button
                asChild
                variant="outline"
                className="
                border-red-500 
                text-red-600 
                hover:text-red-600 
                hover:bg-red-50 
                hover:border-red-600
              "
              >
                <Link href="/auth/login">
                  <FileText className="w-4 h-4 mr-2" />
                  Déconnexion
                </Link>
              </Button>


              {/* Create prescription */}
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

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-10">
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
