// services/patientService.ts
import { apiClient } from '@/lib/api';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  bloodType?: string;
}

export const patientService = {
  async getAllPatients(): Promise<Patient[]> {
    try {
      console.log('🔍 Chargement de tous les patients...');
      const patients = await apiClient.apiCall('/users?role=patient');
      console.log('✅ Patients chargés:', patients.length);
      return patients;
    } catch (error) {
      console.error('❌ Erreur chargement patients:', error);
      // Retourner des patients de démonstration
      return this.getDemoPatients();
    }
  },

  async getPatientById(id: string): Promise<Patient> {
    try {
      return await apiClient.apiCall(`/users/patient/${id}`);
    } catch (error) {
      console.error('❌ Erreur chargement patient:', error);
      const patients = this.getDemoPatients();
      return patients.find(p => p.id === id) || patients[0];
    }
  },

  async getDoctorPatients(doctorId: string): Promise<Patient[]> {
    try {
      console.log('🔍 Chargement des patients du docteur:', doctorId);
      const patients = await apiClient.apiCall(`/doctors/${doctorId}/patients`);
      return patients;
    } catch (error) {
      console.error('❌ Erreur chargement patients docteur:', error);
      return this.getDemoPatients();
    }
  },

  getDemoPatients(): Patient[] {
    return [
      {
        id: 'patient-1',
        firstName: 'Marie',
        lastName: 'Martin',
        email: 'marie.martin@email.com',
        phone: '01 23 45 67 89',
        dateOfBirth: '1985-03-15',
        address: '123 Avenue des Champs, Paris',
        bloodType: 'A+'
      },
      {
        id: 'patient-2',
        firstName: 'Pierre',
        lastName: 'Durand',
        email: 'pierre.durand@email.com',
        phone: '01 34 56 78 90',
        dateOfBirth: '1978-07-22',
        address: '456 Rue du Commerce, Lyon',
        bloodType: 'O+'
      },
      {
        id: 'patient-3',
        firstName: 'Sophie',
        lastName: 'Laurent',
        email: 'sophie.laurent@email.com',
        phone: '01 45 67 89 01',
        dateOfBirth: '1990-11-30',
        address: '789 Boulevard Saint-Germain, Marseille',
        bloodType: 'B+'
      },
      {
        id: 'patient-4',
        firstName: 'Luc',
        lastName: 'Moreau',
        email: 'luc.moreau@email.com',
        phone: '01 56 78 90 12',
        dateOfBirth: '1982-05-18',
        address: '321 Rue de la République, Lille',
        bloodType: 'AB+'
      },
      {
        id: 'patient-5',
        firstName: 'Alice',
        lastName: 'Petit',
        email: 'alice.petit@email.com',
        phone: '01 67 89 01 23',
        dateOfBirth: '1975-12-08',
        address: '654 Avenue Victor Hugo, Toulouse',
        bloodType: 'A-'
      }
    ];
  }
};