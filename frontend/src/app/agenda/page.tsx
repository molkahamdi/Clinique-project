"use client";

import { useEffect, useState } from "react";
import CalendarView from "./components/CalendarView";
import AppointmentList from "./components/AppointmentList";
import AppointmentForm from "./components/AppointmentForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { toast } from "sonner";
import { getAppointments, createAppointment, deleteAppointment, updateAppointment } from "./data/appointments";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Appointment } from "@/types/appointment";

export default function AgendaPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [open, setOpen] = useState(false);
  const [editAppt, setEditAppt] = useState<Appointment | null>(null);
  const [search, setSearch] = useState("");
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Impossible de charger les rendez-vous");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (apptData: Omit<Appointment, 'id'> | Appointment) => {
    try {
      if (editAppt) {
        // Modification
        await updateAppointment(editAppt.id, apptData);
        toast.success("Rendez-vous modifié avec succès");
      } else {
        // Création
        await createAppointment(apptData as Omit<Appointment, 'id'>);
        toast.success("Rendez-vous créé avec succès");
      }
      setOpen(false);
      setEditAppt(null);
      fetchAppointments();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de l'enregistrement");
    }
  };

  const handleEdit = (appt: Appointment) => {
    setEditAppt(appt);
    setOpen(true);
  };

  const handleDelete = async () => {
    if (!toDeleteId) return;
    try {
      await deleteAppointment(toDeleteId);
      toast.success("Rendez-vous supprimé avec succès");
      setToDeleteId(null);
      fetchAppointments();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const filteredAppointments = appointments.filter((appt) =>
    appt.patient.toLowerCase().includes(search.toLowerCase()) ||
    appt.email.toLowerCase().includes(search.toLowerCase()) ||
    appt.phone.includes(search)
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#f3f4f6] to-[#e5e7eb] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f172a]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-md">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          <Link href="/home" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-[#0f172a] font-bold">M</div>
            <span className="text-xl font-bold text-white">Medi</span>
          </Link>
          <nav className="hidden md:flex space-x-8 font-medium text-white">
            <Link href="/home" className="hover:text-cyan-300 transition">Home</Link>
            <Link href="/about" className="hover:text-cyan-300 transition">About</Link>
            <Link href="/departments" className="hover:text-cyan-300 transition">Pages</Link>
            <Link href="/contact" className="hover:text-cyan-300 transition">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative flex flex-1 items-center justify-center text-center text-white pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a]/90 via-[#1e293b]/80 to-[#0f172a]/90" />
        <div className="relative z-10 max-w-4xl px-6">
          <p className="uppercase tracking-wider text-sm text-cyan-300 mb-2">
            GESTION DES RENDEZ-VOUS
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Planifiez la <span className="text-cyan-300">santé</span> <br />
            de demain, aujourd'hui.
          </h1>
          <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);
            if (!isOpen) {
              setEditAppt(null);
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white hover:bg-white hover:text-[#0f172a] font-bold px-8 py-6 rounded-xl shadow-lg text-lg">
                + Nouveau rendez-vous
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl bg-white dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editAppt ? "Modifier le rendez-vous" : "Nouveau rendez-vous"}
                </DialogTitle>
              </DialogHeader>
              <AppointmentForm 
                onSubmit={handleAdd} 
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

      {/* Recherche */}
      <div className="max-w-2xl mx-auto px-6 mb-10 -mt-8 relative z-20">
        <div className="relative">
          <Input
            placeholder="Rechercher un patient, email ou téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 bg-white/95 dark:bg-gray-800/95 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-500 focus:ring-cyan-300 rounded-xl py-6 text-lg shadow-lg"
          />
          <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 pb-16">
        {loading ? (
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg animate-pulse">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto px-6">
            <CalendarView appointments={filteredAppointments} />
            <AppointmentList
              appointments={filteredAppointments}
              onEdit={handleEdit}
              onDelete={(id) => setToDeleteId(id)}
            />
          </div>
        )}
      </div>

      {/* Dialogue de suppression */}
      <Dialog open={toDeleteId !== null} onOpenChange={(isOpen) => !isOpen && setToDeleteId(null)}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Confirmer la suppression
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Cette action est irréversible. Voulez-vous vraiment supprimer ce rendez-vous ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-3 sm:gap-0">
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