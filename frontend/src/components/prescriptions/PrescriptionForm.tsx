'use client';

import { useState, useEffect } from 'react';
import { prescriptionService } from '@/services/prescriptionService';
import { patientService, Patient } from '@/services/patientService';
import { CreatePrescriptionDto, PrescriptionItem } from '@/types/prescription';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, User, Calendar } from 'lucide-react';

interface PrescriptionFormProps {
  onSuccess: () => void;
  initialData?: Partial<CreatePrescriptionDto>;
}

export function PrescriptionForm({ onSuccess, initialData }: PrescriptionFormProps) {
  const [loading, setLoading] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  
  const [formData, setFormData] = useState<CreatePrescriptionDto>({
    date: new Date().toISOString().split('T')[0],
    patientId: initialData?.patientId || '',
    doctorName: initialData?.doctorName || '',
    doctorSpecialty: initialData?.doctorSpecialty || '',
    notes: initialData?.notes || '',
    items: initialData?.items || [
      {
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
      }
    ]
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.doctorName || formData.items.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Valider que tous les médicaments ont les champs requis
    const invalidItems = formData.items.filter(item => 
      !item.medicationName || !item.dosage || !item.frequency || !item.duration
    );
    
    if (invalidItems.length > 0) {
      alert('Veuillez remplir tous les champs obligatoires pour chaque médicament');
      return;
    }

    setLoading(true);

    try {
      await prescriptionService.createPrescription(formData);
      alert('Ordonnance créée avec succès !');
      onSuccess();
    } catch (error) {
      console.error('Error creating prescription:', error);
      alert('Erreur lors de la création de l\'ordonnance');
    } finally {
      setLoading(false);
    }
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          medicationName: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: ''
        }
      ]
    }));
  };

  const removeMedication = (index: number) => {
    if (formData.items.length <= 1) {
      alert('Une ordonnance doit contenir au moins un médicament');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateMedication = (index: number, field: keyof PrescriptionItem, value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const updateField = (field: keyof CreatePrescriptionDto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getSelectedPatient = () => {
    return patients.find(p => p.id === formData.patientId);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Nouvelle Ordonnance Médicale</CardTitle>
          <CardDescription>
            Remplissez les informations pour créer une nouvelle ordonnance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sélection du patient */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Informations Patient
              </h3>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Patient *
                </label>
                {patientsLoading ? (
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span>Chargement des patients...</span>
                  </div>
                ) : (
                  <select
                    value={formData.patientId}
                    onChange={(e) => updateField('patientId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionner un patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} 
                        {patient.dateOfBirth && ` - ${new Date(patient.dateOfBirth).toLocaleDateString('fr-FR')}`}
                        {patient.phone && ` - ${patient.phone}`}
                      </option>
                    ))}
                  </select>
                )}
                {patients.length === 0 && !patientsLoading && (
                  <p className="text-sm text-red-600">
                    Aucun patient trouvé dans le système
                  </p>
                )}
              </div>

              {/* Informations du patient sélectionné */}
              {formData.patientId && getSelectedPatient() && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Patient sélectionné :</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Nom :</span>
                      <p>{getSelectedPatient()?.firstName} {getSelectedPatient()?.lastName}</p>
                    </div>
                    <div>
                      <span className="font-medium">Email :</span>
                      <p>{getSelectedPatient()?.email}</p>
                    </div>
                    {getSelectedPatient()?.phone && (
                      <div>
                        <span className="font-medium">Téléphone :</span>
                        <p>{getSelectedPatient()?.phone}</p>
                      </div>
                    )}
                    {getSelectedPatient()?.dateOfBirth && (
                      <div>
                        <span className="font-medium">Date de naissance :</span>
                        <p>{new Date(getSelectedPatient()!.dateOfBirth!).toLocaleDateString('fr-FR')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Informations de l'ordonnance */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Informations de l'Ordonnance
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date de l'ordonnance *
                  </label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateField('date', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Nom du médecin *
                  </label>
                  <Input
                    value={formData.doctorName}
                    onChange={(e) => updateField('doctorName', e.target.value)}
                    placeholder="Dr. Nom Prénom"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Spécialité du médecin
                  </label>
                  <Input
                    value={formData.doctorSpecialty}
                    onChange={(e) => updateField('doctorSpecialty', e.target.value)}
                    placeholder="Médecin généraliste"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes et observations
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Notes supplémentaires..."
                />
              </div>
            </div>

            {/* Médicaments */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Médicaments prescrits</h3>
                <Button type="button" onClick={addMedication} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Ajouter un médicament
                </Button>
              </div>

              {formData.items.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium">Médicament {index + 1}</h4>
                      <Button
                        type="button"
                        onClick={() => removeMedication(index)}
                        variant="outline"
                        size="sm"
                        disabled={formData.items.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Nom du médicament *
                        </label>
                        <Input
                          value={item.medicationName}
                          onChange={(e) => updateMedication(index, 'medicationName', e.target.value)}
                          placeholder="Paracétamol"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Dosage *
                        </label>
                        <Input
                          value={item.dosage}
                          onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                          placeholder="500mg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Fréquence *
                        </label>
                        <Input
                          value={item.frequency}
                          onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                          placeholder="3 fois par jour"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Durée *
                        </label>
                        <Input
                          value={item.duration}
                          onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                          placeholder="7 jours"
                          required
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Instructions spéciales
                        </label>
                        <textarea
                          value={item.instructions}
                          onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Prendre après les repas..."
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Boutons d'action */}
            <div className="flex space-x-4 pt-6">
              <Button type="button" variant="outline" onClick={onSuccess}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading || !formData.patientId}>
                {loading ? 'Création...' : 'Créer l\'ordonnance'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}