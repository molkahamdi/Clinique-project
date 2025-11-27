'use client';

import { forwardRef } from 'react';
import { Prescription } from '@/types/prescription';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PrescriptionPrintProps {
  prescription: Prescription;
}

export const PrescriptionPrint = forwardRef<HTMLDivElement, PrescriptionPrintProps>(
  ({ prescription }, ref) => {
    const patientInfo = prescription.patient || {
      firstName: prescription.patientFirstName || '',
      lastName: prescription.patientLastName || '',
      dateOfBirth: prescription.patientDateOfBirth || '',
      phone: prescription.patientPhone || '',
    };

    const calculateAge = (dateOfBirth: string) => {
      if (!dateOfBirth) return 'N/A';
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    };

    return (
      <div ref={ref} className="bg-white p-8 print:p-0 font-sans">
        <style jsx global>{`
          @media print {
            @page {
              size: A4;
              margin: 1.5cm;
            }
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
              font-family: 'Arial', sans-serif;
            }
            .no-break {
              page-break-inside: avoid;
            }
          }
        `}</style>

        <div className="max-w-4xl mx-auto">
          <div className="border-b-2 border-gray-800 pb-4 mb-6 no-break">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase tracking-wide">
                  {prescription.doctorName || 'Cabinet Médical'}
                </h1>
                {prescription.doctorSpecialty && (
                  <p className="text-lg text-gray-700 font-medium">{prescription.doctorSpecialty}</p>
                )}
                <div className="mt-3 text-sm text-gray-600 space-y-1">
                  <p>📞 Téléphone: +216 70 000 000</p>
                  <p>📧 Email: contact@cabinetmedical.tn</p>
                  <p>📍 123 Avenue Habib Bourguiba, Tunis</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="mb-3">
                  <div className="text-sm text-gray-500">N° Ordonnance</div>
                  <div className="font-mono text-lg font-bold">{prescription.id?.slice(-8) || 'N/A'}</div>
                </div>
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded">
                  {format(new Date(prescription.date), 'dd MMMM yyyy', { locale: fr })}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 no-break">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
              INFORMATIONS PATIENT
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded">
                <span className="font-semibold block text-gray-700">Nom complet:</span>
                <span className="text-gray-900">{patientInfo.firstName} {patientInfo.lastName}</span>
              </div>
              {patientInfo.dateOfBirth && (
                <>
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="font-semibold block text-gray-700">Âge:</span>
                    <span className="text-gray-900">{calculateAge(patientInfo.dateOfBirth)} ans</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <span className="font-semibold block text-gray-700">Date de naissance:</span>
                    <span className="text-gray-900">
                      {format(new Date(patientInfo.dateOfBirth), 'dd/MM/yyyy')}
                    </span>
                  </div>
                </>
              )}
              {patientInfo.phone && (
                <div className="bg-gray-50 p-3 rounded">
                  <span className="font-semibold block text-gray-700">Téléphone:</span>
                  <span className="text-gray-900">{patientInfo.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8 no-break">
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
              PRESCRIPTION MÉDICALE
            </h2>

            <div className="space-y-4">
              {prescription.items.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900">
                      {index + 1}. {item.medicationName}
                      {/* Correction: Vérification explicite du type boolean */}
                      {item.urgent === true && (
                        <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                          URGENT
                        </span>
                      )}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <div className="bg-blue-50 p-2 rounded">
                      <span className="font-semibold text-gray-700">Dosage:</span>
                      <div className="text-gray-900 mt-1">{item.dosage}</div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <span className="font-semibold text-gray-700">Fréquence:</span>
                      <div className="text-gray-900 mt-1">{item.frequency}</div>
                    </div>
                    <div className="bg-blue-50 p-2 rounded">
                      <span className="font-semibold text-gray-700">Durée:</span>
                      <div className="text-gray-900 mt-1">{item.duration}</div>
                    </div>
                  </div>
                  
                  {item.instructions && (
                    <div className="mt-3 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                      <span className="font-semibold text-gray-700 block mb-1">
                        Instructions spéciales:
                      </span>
                      <p className="text-gray-800 text-sm">{item.instructions}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {prescription.notes && (
            <div className="mb-8 no-break">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
                RECOMMANDATIONS MÉDICALES
              </h2>
              <div className="bg-gray-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {prescription.notes}
                </p>
              </div>
            </div>
          )}

          <div className="mt-12 no-break">
            <div className="flex justify-between items-end">
              <div className="text-xs text-gray-500 max-w-md">
                <p className="font-semibold mb-2">Mentions légales:</p>
                <ul className="space-y-1">
                  <li>• Ordonnance valable 3 mois à compter de la date d'émission</li>
                  <li>• À conserver pendant 1 an minimum</li>
                  <li>• Présenter cette ordonnance à votre pharmacien</li>
                </ul>
              </div>
              
              <div className="text-center">
                <div className="border-t-2 border-gray-400 pt-2 px-8 mb-2">
                  <p className="font-bold text-gray-900">{prescription.doctorName}</p>
                  {prescription.doctorSpecialty && (
                    <p className="text-sm text-gray-600">{prescription.doctorSpecialty}</p>
                  )}
                </div>
                <p className="text-xs text-gray-500">Signature et cachet</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
            <p>Document généré le {format(new Date(), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}</p>
            <p className="mt-1">Cabinet Médical - SIRET: 123 456 789 00012 - RPPS: 12345678901</p>
          </div>
        </div>
      </div>
    );
  }
);

PrescriptionPrint.displayName = 'PrescriptionPrint';