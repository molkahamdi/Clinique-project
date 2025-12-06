"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { FileText, User, Stethoscope, Calendar, DollarSign, Receipt, FileCheck } from "lucide-react";

export default function NewInvoicePage() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const appointmentId = params.get("appointmentId");

  const [appointment, setAppointment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ===============================
  // FORM STATE
  // ===============================
  const [form, setForm] = useState({
    consultationFee: "" as number | string,
    tax: 0,
    totalFinal: 0,
    notes:
      "Merci de suivre les recommandations médicales. En cas de persistance des symptômes, consultez votre médecin. Bon rétablissement.",
  });

  // ===============================
  // UPDATE FIELDS
  // ===============================
  const updateField = (name: string, value: any) => {
    const updated = { ...form, [name]: value };

    if (name === "consultationFee") {
      const fee = Number(value) || 0;
      updated.tax = fee * 0.07;
      updated.totalFinal = fee + updated.tax;
    }

    setForm(updated);
  };

  // ===============================
  // LOAD APPOINTMENT DETAILS
  // ===============================
  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiClient.apiCall(`/appointments/${appointmentId}`, {
          method: "GET",
        });

        setAppointment(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [appointmentId]);

  // ===============================
  // CREATE INVOICE
  // ===============================
  const createInvoice = async () => {
    try {
      const response = await fetch(`http://localhost:3001/invoices/${appointmentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Backend response:", errorText);
        throw new Error("Erreur backend: " + errorText);
      }

      const invoice = await response.json();

      toast({
        title: "Facture créée",
        description: "La facture a été générée avec succès.",
      });

      router.push(`/invoice/${invoice.id}`);
    } catch (e: any) {
      console.error("Invoice error:", e.message);

      toast({
        title: "Erreur",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  // ===============================
  // LOADING / INVALID STATE
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Rendez-vous introuvable</h2>
          <p className="text-gray-600">Le rendez-vous demandé n'existe pas.</p>
        </div>
      </div>
    );
  }

  const { patient, doctor } = appointment;

  // ===============================
  // PAGE UI
  // ===============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nouvelle Facture</h1>
              <p className="text-gray-500 text-sm">Créez une facture pour la consultation</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Appointment Details */}
          <div className="lg:col-span-1 space-y-4">
            {/* Patient Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Patient</h3>
              </div>
              <p className="text-lg font-medium text-gray-800">
                {patient.firstName} {patient.lastName}
              </p>
            </div>

            {/* Doctor Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-cyan-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Médecin</h3>
              </div>
              <p className="text-lg font-medium text-gray-800">
                Dr. {doctor.firstName} {doctor.lastName}
              </p>
            </div>

            {/* Date Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Date</h3>
              </div>
              <p className="text-lg font-medium text-gray-800">{appointment.date}</p>
            </div>
          </div>

          {/* Right Column - Invoice Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              {/* Consultation Fee */}
              <div className="mb-6">
                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                  Frais de consultation
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="border-2 border-gray-200 px-4 py-3 rounded-xl w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg"
                    value={form.consultationFee}
                    onChange={(e) => updateField("consultationFee", e.target.value)}
                    placeholder="0.00"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    TND
                  </span>
                </div>
              </div>

              {/* Calculation Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 mb-6 border border-blue-100">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Sous-total</span>
                    <span className="text-gray-800 font-semibold text-lg">
                      {(Number(form.consultationFee) || 0).toFixed(2)} TND
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 font-medium">Taxe (7%)</span>
                    <span className="text-gray-800 font-semibold text-lg">
                      {form.tax.toFixed(2)} TND
                    </span>
                  </div>
                  <div className="border-t-2 border-blue-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-900 font-bold text-lg">Total Final</span>
                      <span className="text-blue-600 font-bold text-2xl">
                        {form.totalFinal.toFixed(2)} TND
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="flex items-center gap-2 font-semibold text-gray-700 mb-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Notes médicales
                </label>
                <textarea
                  className="border-2 border-gray-200 px-4 py-3 rounded-xl w-full focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  rows={5}
                  placeholder="Ajouter des notes..."
                />
              </div>

              {/* Submit Button */}
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] text-lg"
                onClick={createInvoice}
              >
                <Receipt className="w-5 h-5 mr-2" />
                Créer la Facture
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}