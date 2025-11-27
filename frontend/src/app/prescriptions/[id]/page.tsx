'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { prescriptionService } from '@/services/prescriptionService';
import { Prescription } from '@/types/prescription';
import { PrescriptionPrint } from '@/components/prescriptions/PrescriptionPrint';

export default function PrescriptionViewPage() {
  const params = useParams();
  const router = useRouter();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params.id) {
      loadPrescription();
    }
  }, [params.id]);

  const loadPrescription = async () => {
    try {
      const data = await prescriptionService.getPrescription(params.id as string);
      setPrescription(data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement de l\'ordonnance');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // Pour le téléchargement PDF, on utilise aussi l'impression
    // Dans un cas réel, vous utiliseriez une librairie comme html2pdf.js
    window.print();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Chargement de l'ordonnance...</p>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="container mx-auto py-8 text-center">
        <p className="text-lg text-gray-600">Ordonnance non trouvée</p>
        <Button onClick={() => router.push('/prescriptions')} className="mt-4">
          Retour aux ordonnances
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Barre d'actions */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button variant="outline" onClick={() => router.push('/prescriptions')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux ordonnances
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </Button>
          <Button onClick={handleDownloadPDF}>
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
        </div>
      </div>

      {/* Aperçu de l'ordonnance */}
      <div className="print:bg-white print:shadow-none">
        <PrescriptionPrint ref={printRef} prescription={prescription} />
      </div>

      {/* Style pour l'impression */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:bg-white,
          .print\\:bg-white * {
            visibility: visible;
          }
          .print\\:bg-white {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}