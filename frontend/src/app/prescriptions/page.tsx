'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PrescriptionList } from '@/components/prescriptions/PrescriptionList';
import { useRouter } from 'next/navigation';
import { patientService, Patient } from '@/services/patientService';

export default function PrescriptionsPage() {
  const router = useRouter();
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const patientsData = await patientService.getAllPatients();
      setPatients(patientsData);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setPatientsLoading(false);
    }
  };

  const handleNewPrescription = () => {
    if (selectedPatientId) {
      router.push(`/prescriptions/new?patientId=${selectedPatientId}`);
    } else {
      router.push('/prescriptions/new');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ordonnances</h1>
        <Button onClick={handleNewPrescription}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle ordonnance
        </Button>
      </div>

      {/* Sélection du patient */}
      <div className="mb-6 p-4 bg-white rounded-lg border shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Filtrer par patient</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Tous les patients</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName}
                  {patient.dateOfBirth && ` - ${new Date(patient.dateOfBirth).toLocaleDateString('fr-FR')}`}
                </option>
              ))}
            </select>
          </div>
          {selectedPatientId && (
            <Button
              variant="outline"
              onClick={() => setSelectedPatientId('')}
            >
              Effacer le filtre
            </Button>
          )}
        </div>
        {patientsLoading && (
          <p className="text-sm text-gray-500 mt-2">Chargement des patients...</p>
        )}
      </div>

      {/* Liste des ordonnances */}
      <PrescriptionList patientId={selectedPatientId || undefined} />
    </div>
  );
}