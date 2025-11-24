import { Prescription, CreatePrescriptionDto } from '@/types/prescription';
import { apiClient } from '@/lib/api';

export const prescriptionService = {
  async getPatientPrescriptions(patientId: string): Promise<Prescription[]> {
    try {
      console.log('🔍 Chargement des ordonnances pour le patient:', patientId);
      const prescriptions = await apiClient.apiCall(`/prescriptions/patient/${patientId}`);
      console.log('✅ Ordonnances chargées:', prescriptions);
      return prescriptions;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des ordonnances:', error);
      throw error;
    }
  },

  async getPrescription(id: string): Promise<Prescription> {
    return await apiClient.apiCall(`/prescriptions/${id}`);
  },

  async createPrescription(data: CreatePrescriptionDto): Promise<Prescription> {
    return await apiClient.apiCall('/prescriptions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deletePrescription(id: string): Promise<void> {
    await apiClient.apiCall(`/prescriptions/${id}`, {
      method: 'DELETE',
    });
  }
};