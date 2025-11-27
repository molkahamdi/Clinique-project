'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Eye, Printer, Trash2, RefreshCw } from 'lucide-react';
import { prescriptionService } from '@/services/prescriptionService';
import { Prescription } from '@/types/prescription';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PrescriptionListProps {
  patientId?: string;
}

export function PrescriptionList({ patientId }: PrescriptionListProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPrescriptions();
  }, [patientId]);

  const loadPrescriptions = async () => {
    try {
      setIsLoading(true);
      let data: Prescription[];
      
      if (patientId) {
        data = await prescriptionService.getPatientPrescriptions(patientId);
      } else {
        // Si pas de patient spécifique, on ne charge rien
        // Dans une vraie application, vous pourriez avoir une méthode getAll()
        data = [];
      }
      
      setPrescriptions(data);
    } catch (error) {
      console.error('Erreur lors du chargement des prescriptions:', error);
      setPrescriptions([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPrescriptions();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette ordonnance ?')) return;
    try {
      await prescriptionService.deletePrescription(id);
      loadPrescriptions();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Chargement des ordonnances...</p>
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-gray-500">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg mb-2">Aucune ordonnance trouvée</p>
          {patientId ? (
            <p className="text-sm">Ce patient n'a pas encore d'ordonnance</p>
          ) : (
            <p className="text-sm">Sélectionnez un patient pour voir ses ordonnances</p>
          )}
          <Button 
            variant="outline" 
            onClick={handleRefresh} 
            className="mt-4"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {patientId ? 'Ordonnances du patient' : 'Toutes les ordonnances'} 
          <span className="text-gray-500 text-sm ml-2">
            ({prescriptions.length} ordonnance{prescriptions.length > 1 ? 's' : ''})
          </span>
        </h3>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {prescriptions.map((prescription) => (
        <Card key={prescription.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="bg-gray-50 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Ordonnance du {format(new Date(prescription.date), 'dd MMMM yyyy', { locale: fr })}
                </CardTitle>
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Patient:</span> {prescription.patient?.firstName} {prescription.patient?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Médecin:</span> {prescription.doctorName}
                    {prescription.doctorSpecialty && ` - ${prescription.doctorSpecialty}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/prescriptions/${prescription.id}`, '_blank')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/prescriptions/${prescription.id}/print`, '_blank')}
                >
                  <Printer className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(prescription.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-sm text-gray-700">Médicaments prescrits:</h4>
              <div className="grid gap-2">
                {prescription.items.map((item, idx) => (
                  <div key={idx} className="border-l-4 border-blue-200 pl-3 py-2 bg-blue-50 rounded-r">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <strong className="text-gray-900">{item.medicationName}</strong>
                        <div className="text-gray-600 text-sm mt-1 space-y-1">
                          <div><span className="font-medium">Dosage:</span> {item.dosage}</div>
                          <div><span className="font-medium">Fréquence:</span> {item.frequency}</div>
                          <div><span className="font-medium">Durée:</span> {item.duration}</div>
                          {item.instructions && (
                            <div className="mt-1">
                              <span className="font-medium">Instructions:</span> 
                              <span className="text-gray-500 italic"> {item.instructions}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {item.urgent === true && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded ml-2 whitespace-nowrap self-start">
                          URGENT
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {prescription.notes && (
                <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong className="font-semibold">Conseils et observations:</strong>{' '}
                    {prescription.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}