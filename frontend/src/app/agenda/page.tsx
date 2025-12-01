// app/agenda/page.tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { apiClient } from "@/lib/api";
import CalendarView from "./components/CalendarView";
import AppointmentList from "./components/AppointmentList";
import AppointmentForm from "./components/AppointmentForm";

import { Sun, Moon } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

import {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
} from "@/types/appointment";

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [open, setOpen] = useState(false);
  const [editAppt, setEditAppt] = useState<Appointment | null>(null);
  const [search, setSearch] = useState("");
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  // ============================
  // LOAD ALL APPOINTMENTS
  // ============================
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getAppointments();
      setAppointments(data);
    } catch (err: any) {
      toast.error(err.message || "Impossible de charger les rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ============================
  // CREATE OR UPDATE
  // ============================
  const handleSubmit = async (dto: CreateAppointmentDto | UpdateAppointmentDto) => {
    try {
      if (editAppt) {
        // -------- UPDATE -------------
        await apiClient.updateAppointment(editAppt.id, dto);
        toast.success("Rendez-vous modifié");
      } else {
        // -------- CREATE -------------
        await apiClient.createAppointment(dto as CreateAppointmentDto);
        toast.success("Rendez-vous créé");
      }

      setOpen(false);
      setEditAppt(null);
      fetchAppointments();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'enregistrement");
    }
  };

  // ============================
  // DELETE
  // ============================
  const handleDelete = async () => {
    if (!toDeleteId) return;

    try {
      await apiClient.deleteAppointment(toDeleteId);
      toast.success("Rendez-vous supprimé");
      setToDeleteId(null);
      fetchAppointments();
    } catch {
      toast.error("Erreur lors de la suppression");
    }
  };

  // ============================
  // SEARCH FILTER
  // ============================
  const filtered = appointments.filter((appt) => {
    const fullName =
      `${appt.patient?.firstName || ""} ${appt.patient?.lastName || ""}`.toLowerCase();

    return (
      fullName.includes(search.toLowerCase()) ||
      (appt.patient?.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (appt.patient?.phone || "").toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#eef1f5] to-[#e2e8f0] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">

      {/* ================= HEADER ================= */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 border-b bg-white/40 dark:bg-[#0f172a]/60 backdrop-blur shadow-md"
      >
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link href="/home" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-[#0f172a] dark:bg-white rounded-full flex items-center justify-center text-white dark:text-[#0f172a] font-bold">
              M
            </div>
            <span className="text-xl font-bold text-[#0f172a] dark:text-white">
              Medi
            </span>
          </Link>

          <nav className="hidden md:flex space-x-8 font-medium text-[#0f172a] dark:text-white">
            <Link href="/home" className="hover:text-cyan-400">Home</Link>
            <Link href="/about" className="hover:text-cyan-400">About</Link>
            <Link href="/departments" className="hover:text-cyan-400">Pages</Link>
            <Link href="/contact" className="hover:text-cyan-400">Contact</Link>
          </nav>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-[#0f172a] dark:bg-white text-white dark:text-[#0f172a] shadow"
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </button>
        </div>
      </motion.header>

      {/* ================= HERO ================= */}
      <section className="relative pt-28 pb-16 text-center text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#1e293b]/85 to-[#0f172a]/95"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold mb-6"
          >
            Planifiez vos consultations <br />
            <span className="text-cyan-300">en toute simplicité</span>
          </motion.h1>

          {/* MODAL NEW APPOINTMENT */}
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditAppt(null); }}>
            <DialogTrigger asChild>
              <Button className="px-6 py-4 bg-cyan-600 hover:bg-cyan-700 text-white text-lg rounded-xl shadow-lg">
                + Nouveau rendez-vous
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">
                  {editAppt ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
                </DialogTitle>
              </DialogHeader>

              <AppointmentForm
                onSubmit={handleSubmit}
                initialData={editAppt}
                onCancel={() => {
                  setOpen(false);
                  setEditAppt(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-1 mt-12 pb-20">
        {loading ? (
          <p className="text-center mt-20">Chargement...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto px-6">
            <CalendarView appointments={filtered} />

            <AppointmentList
              appointments={filtered}
              onDelete={(id) => setToDeleteId(id)}
              onEdit={(appt) => {
                setEditAppt(appt);
                setOpen(true);
              }}
            />
          </div>
        )}
      </div>

      {/* ================= DELETE CONFIRM ================= */}
      <Dialog open={!!toDeleteId} onOpenChange={() => setToDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer ce rendez-vous ?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDeleteId(null)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
