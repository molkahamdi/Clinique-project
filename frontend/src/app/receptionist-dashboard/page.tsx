"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { Bell, CalendarDays } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AppointmentStatus } from "@/types/appointment";
import { useRouter } from "next/navigation";

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  patient?: {
    firstName: string;
    lastName: string;
  };
}

export default function ReceptionistDashboard() {
  const [totalPatients, setTotalPatients] = useState<number | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  // 🔎 FILTRES
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const router = useRouter();

  const fetchStats = async () => {
    try {
      const patients = await apiClient.apiCall("/users?role=patient", {
        method: "GET",
      });
      setTotalPatients(patients.length);

      const allAppointments = await apiClient.getAppointments();
      setAppointments(allAppointments);

      const today = new Date().toISOString().split("T")[0];
      const todayList = allAppointments.filter((appt: Appointment) => appt.date === today);
      setTodayAppointments(todayList);

      const pending = allAppointments.filter(
        (appt: Appointment) => appt.status?.toLowerCase() === "pending"
      );
      setPendingCount(pending.length);
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // ✅ CONFIRM
  const confirmAppointment = async (id: string) => {
    try {
      await apiClient.updateAppointment(id, {
        status: AppointmentStatus.CONFIRMED,
      });

      const updated = appointments.map((appt) =>
        appt.id === id ? { ...appt, status: AppointmentStatus.CONFIRMED } : appt
      );

      setAppointments(updated);

      const pending = updated.filter(
        (appt) => appt.status.toLowerCase() === "pending"
      );
      setPendingCount(pending.length);
    } catch (error) {
      console.error("❌ Error confirming appointment:", error);
    }
  };

  // ❌ CANCEL - Removes appointment from list
  const cancelAppointment = async (id: string) => {
    try {
      await apiClient.updateAppointment(id, {
        status: AppointmentStatus.CANCELLED,
      });

      // Remove the cancelled appointment from the list
      const updated = appointments.filter((appt) => appt.id !== id);

      setAppointments(updated);

      // Update today's appointments if needed
      const today = new Date().toISOString().split("T")[0];
      const todayList = updated.filter((appt: Appointment) => appt.date === today);
      setTodayAppointments(todayList);

      const pending = updated.filter(
        (appt) => appt.status.toLowerCase() === "pending"
      );
      setPendingCount(pending.length);
    } catch (error) {
      console.error("❌ Error cancelling appointment:", error);
    }
  };

  // 🧮 LISTE FILTRÉE
  const filteredAppointments = appointments.filter((appt) => {
    const matchesDate = filterDate ? appt.date === filterDate : true;
    const matchesStatus =
      filterStatus === "ALL"
        ? true
        : appt.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesDate && matchesStatus;
  });

  return (
    <div className="p-8 space-y-8">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Bonjour, Réceptionniste</h1>
          <p className="text-muted-foreground">Tableau de bord administratif</p>
        </div>

        {/* 🔔 NOTIFICATIONS */}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="relative cursor-pointer">
              <Bell className="w-7 h-7 text-gray-700" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-80">
            <p className="p-2 font-medium border-b">Notifications</p>

            {pendingCount === 0 && (
              <p className="p-4 text-sm text-muted-foreground">
                Aucune nouvelle notification.
              </p>
            )}

            {appointments
              .filter((appt) => appt.status.toLowerCase() === "pending")
              .map((appt) => (
                <DropdownMenuItem
                  key={appt.id}
                  className="flex flex-col items-start"
                >
                  <div className="flex justify-between w-full">
                    <div>
                      <span className="font-semibold text-sm">
                        Nouveau RDV —{" "}
                        {appt.patient?.firstName} {appt.patient?.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground block">
                        {appt.date} à {appt.time}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => confirmAppointment(appt.id)}
                      >
                        ✔
                      </Button>

                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-white"
                        onClick={() => cancelAppointment(appt.id)}
                      >
                        ✖
                      </Button>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ================= STATS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">RDV Aujourd'hui</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {loading ? "..." : todayAppointments.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {loading ? "..." : totalPatients}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Total Rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {loading ? "..." : appointments.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{pendingCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* ================= ALL APPOINTMENTS ================= */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">
            Liste de tous les rendez-vous
          </CardTitle>

          {/* Filters section positioned next to title */}
          <div className="flex items-center gap-4">
            {/* Date Filter */}
            <input
              type="date"
              className="border px-3 py-1 rounded-md"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />

            {/* Status Filter */}
            <select
              className="border px-3 py-1 rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Approuved</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => router.push("/agenda")}
            >
              Voir Agenda
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
  {filteredAppointments.length === 0 && (
    <p className="text-muted-foreground">Aucun rendez-vous trouvé.</p>
  )}

  {filteredAppointments.map((appt) => (
    <div
      key={appt.id}
      className="flex items-center justify-between p-4 border rounded-lg"
    >
      {/* LEFT SIDE — DATE + PATIENT */}
      <div className="flex items-center gap-3">
        <CalendarDays className="w-5 h-5 text-primary" />
        <div>
          <p className="font-medium">
            {appt.date} — {appt.time}
          </p>
          <p className="text-sm text-muted-foreground">
            {appt.patient?.firstName} {appt.patient?.lastName}
          </p>
        </div>
      </div>

      {/* RIGHT SIDE — STATUS + ACTION BUTTONS */}
      <div className="flex items-center gap-3">
        {/* STATUS BADGE */}
        <span
          className={`px-4 py-1.5 text-sm font-medium rounded-full ${
            appt.status.toLowerCase() === "confirmed"
              ? "bg-green-500 text-white"
              : appt.status.toLowerCase() === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {appt.status}
        </span>

        {/* ❌ CANCEL BUTTON — ONLY IF CONFIRMED */}
        {appt.status.toLowerCase() === "confirmed" && (
          <button
            onClick={() => cancelAppointment(appt.id)}
            className="px-4 py-1.5 text-sm font-medium rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Annuler
          </button>
        )}

        {/* ⭐ CREATE INVOICE BUTTON — ONLY IF CONFIRMED */}
        {appt.status.toLowerCase() === "confirmed" && (
          <button
            onClick={() =>
              router.push(
                `/receptionist-dashboard/invoice/new?appointmentId=${appt.id}`
              )
            }
            className="px-4 py-1.5 text-sm font-medium rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
          >
            Créer Facture
          </button>
        )}
      </div>
    </div>
  ))}
</CardContent>

      </Card>
    </div>
  );
}