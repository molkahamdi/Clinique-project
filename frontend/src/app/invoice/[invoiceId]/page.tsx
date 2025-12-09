"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { apiClient } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Printer,
  FileDown,
  FileText,
  User,
  Stethoscope,
  Calendar,
  DollarSign,
  Receipt,
  CheckCircle2,
  Clock
} from "lucide-react";

export default function InvoiceDetailsPage() {
  const { invoiceId } = useParams();

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

  // ===============================
  // LOADING STATE
  // ===============================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
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

  // ===============================
  // MAIN UI
  // ===============================
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
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
                {/* --- BUTTON INSTEAD OF TEXT --- */}
                <button
                  className="
        mt-2 px-4 py-1.5
        bg-green-100 text-green-700 
        rounded-full font-medium text-sm
        border border-green-300
        hover:bg-green-200 transition
      "
                  disabled
                >
                  Payée
                </button>
              </div>
            </div>

            {/* Date and Print Button */}
            <div className="flex flex-col items-end gap-3">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-xl border border-green-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-green-700" />
                  <span className="text-green-700 font-semibold text-sm">
                    {new Date(invoice.createdAt || Date.now()).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>

              <Button
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                onClick={() => window.print()}
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Details */}
          <div className="space-y-6">
            {/* Patient Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
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

            {/* Doctor Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
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

            {/* Appointment Date Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
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

          {/* Right Column - Financial Details */}
          <div className="space-y-6">
            {/* Financial Summary Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Détails Financiers</h3>
              </div>

              <div className="space-y-4">
                {/* Consultation Fee */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Frais de consultation</span>
                  <span className="text-gray-900 font-semibold text-lg">
                    {invoice.consultationFee} TND
                  </span>
                </div>

                {/* Tax */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Taxe (7%)</span>
                  <span className="text-gray-900 font-semibold text-lg">
                    {invoice.tax} TND
                  </span>
                </div>

                {/* Total */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 mt-4 border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900 font-bold text-lg">Total à Payer</span>
                    <span className="text-blue-600 font-bold text-3xl">
                      {invoice.totalFinal} TND
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Card */}
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