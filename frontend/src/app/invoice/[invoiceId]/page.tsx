"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Printer,
  FileText,
  User,
  Stethoscope,
  Calendar,
  DollarSign,
  Receipt,
  Clock,
  CheckCircle2
} from "lucide-react";

export default function InvoiceDetailsPage() {
  const { invoiceId } = useParams();
  const searchParams = useSearchParams();
  const status = searchParams.get("status"); // <-- Stripe redirect status

  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        const data = await apiClient.apiCall(`/invoices/${invoiceId}`, {
          method: "GET",
        });
        setInvoice(data);
      } catch (error) {
        console.error("Error loading invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoice();
  }, [invoiceId]);

  const handlePayInvoice = async () => {
    try {
      const res = await fetch(`http://localhost:3001/invoices/pay/${invoice.id}`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        alert("Erreur lors de la création de la session de paiement.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Impossible de démarrer le paiement.");
    }
  };

  // -------------------------------
  // ⏳ LOADING UI
  // -------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de la facture...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Facture introuvable</h2>
          <p className="text-gray-600">La facture demandée n'existe pas.</p>
        </div>
      </div>
    );
  }

  const { appointment } = invoice;
  const patient = appointment.patient;
  const doctor = appointment.doctor;

  // -------------------------------
  // MAIN PAGE UI
  // -------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ============================== */}
        {/* ✔ SUCCESS PAYMENT MESSAGE */}
        {/* ============================== */}
        {status === "success" && (
          <div className="mb-6 bg-green-100 border border-green-300 text-green-800 px-4 py-3 rounded-xl flex items-center gap-3 shadow">
            <CheckCircle2 className="w-5 h-5" />
            <p className="font-semibold">Paiement effectué avec succès ✔</p>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6 border border-gray-100">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Receipt className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Facture #{invoice.invoiceNumber}
                </h1>

                {/* PAY BUTTON */}
                <Button
                  className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                  onClick={handlePayInvoice}
                >
                  Payer maintenant
                </Button>
              </div>
            </div>

            {/* Date and Print Button */}
            <div className="flex flex-col items-end gap-3">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-xl border border-green-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-700" />
                  <span className="text-green-700 font-semibold text-sm">
                    {new Date(invoice.createdAt || Date.now()).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              <Button
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2.5 rounded-xl shadow-lg hover:scale-105 transition"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
            </div>
          </div>
        </div>

        {/* ========================= */}
        {/* CONTENT COLUMNS */}
        {/* ========================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="space-y-6">

            {/* Patient */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 text-sm">Patient</h3>
                  <p className="text-xl font-bold text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </p>
                </div>
              </div>
            </div>

            {/* Doctor */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 text-sm">Médecin Traitant</h3>
                  <p className="text-xl font-bold text-gray-900">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </p>
                </div>
              </div>
            </div>

            {/* Consultation Date */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-500 text-sm">Date de Consultation</h3>
                  <p className="text-xl font-bold text-gray-900">{appointment.date}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">

            {/* Financial Info */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Détails Financiers</h3>
              </div>

              <div className="space-y-4">

                {/* Consultation fee */}
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Frais de consultation</span>
                  <span className="font-semibold">{invoice.consultationFee} TND</span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center pb-3 border-b">
                  <span className="text-gray-600">Taxe (7%)</span>
                  <span className="font-semibold">{invoice.tax} TND</span>
                </div>

                {/* Total */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">Total à Payer</span>
                    <span className="text-blue-600 font-bold text-3xl">
                      {invoice.totalFinal} TND
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* NOTES */}
            {invoice.notes && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-gray-900">Notes Médicales</h3>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                  <p className="text-gray-700 leading-relaxed">{invoice.notes}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
