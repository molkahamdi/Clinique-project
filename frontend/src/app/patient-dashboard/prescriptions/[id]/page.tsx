'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { prescriptionService } from '@/services/prescriptionService';
import { Prescription } from '@/types/prescription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, User, Calendar, ArrowLeft, Pill, Printer, Link } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function PrescriptionDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [prescription, setPrescription] = useState<Prescription | null>(null);
  const [loading, setLoading] = useState(true);

  const prescriptionId = params.id as string;

  useEffect(() => {
    const loadPrescription = async () => {
      try {
        const data = await prescriptionService.getPrescription(prescriptionId);
        setPrescription(data);
      } catch (error) {
        console.error('Error loading prescription:', error);
        alert('Erreur lors du chargement de l\'ordonnance');
      } finally {
        setLoading(false);
      }
    };

    if (prescriptionId) {
      loadPrescription();
    }
  }, [prescriptionId]);

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'ordonnance...</p>
        </div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Ordonnance non trouvée</p>
          <Button onClick={() => router.push('/patient-dashboard')} className="mt-4">
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => router.push('/patient-dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Détails de l'ordonnance</h1>
              <p className="text-gray-600">Ordonnance du {formatDate(prescription.date)}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Informations de l'ordonnance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Date:</span>
                  </div>
                  <span>{formatDate(prescription.date)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Médecin:</span>
                  </div>
                  <span>
                    Dr. {prescription.doctorName}
                    {prescription.doctorSpecialty && (
                      <span className="text-gray-600"> - {prescription.doctorSpecialty}</span>
                    )}
                  </span>
                </div>

                {prescription.notes && (
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium">Notes du médecin:</span>
                    </div>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {prescription.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Médicaments prescrits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-green-600" />
                  Médicaments prescrits ({prescription.items?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prescription.items?.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-white">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg text-gray-900">
                          {item.medicationName}
                        </h4>
                        <Badge variant="outline">Médicament {index + 1}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Dosage:</span>
                          <p>{item.dosage}</p>
                        </div>
                        <div>
                          <span className="font-medium">Fréquence:</span>
                          <p>{item.frequency}</p>
                        </div>
                        <div>
                          <span className="font-medium">Durée:</span>
                          <p>{item.duration}</p>
                        </div>
                      </div>
                      {item.instructions && (
                        <div className="mt-3">
                          <span className="font-medium text-sm">Instructions spéciales:</span>
                          <p className="text-sm text-gray-600 mt-1">{item.instructions}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations patient et actions */}
          <div className="space-y-6">
            {/* Informations patient */}
            <Card>
              <CardHeader>
                <CardTitle>Informations patient</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Nom complet</p>
                  <p className="text-sm text-gray-600">
                    {user?.firstName} {user?.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Téléphone</p>
                  <p className="text-sm text-gray-600">{user?.phone || 'Non renseigné'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" onClick={handlePrint}>
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimer l'ordonnance
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/patient-dashboard">
                      Retour au tableau de bord
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}