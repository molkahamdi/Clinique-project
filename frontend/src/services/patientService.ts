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
  // 🔹 Get ALL patients (real DB only)
  async getAllPatients(): Promise<Patient[]> {
    console.log('🔍 Fetching all patients from API...');
    return await apiClient.apiCall('/users?role=patient');
  },

  // 🔹 Get a specific patient by ID (real DB only)
  async getPatientById(id: string): Promise<Patient> {
    console.log('🔍 Fetching patient by ID:', id);
    return await apiClient.apiCall(`/users/patient/${id}`);
  },

  // 🔹 Get all patients supervised by a doctor (real DB only)
  async getDoctorPatients(doctorId: string): Promise<Patient[]> {
    console.log('🔍 Fetching doctor patients:', doctorId);
    return await apiClient.apiCall(`/doctors/${doctorId}/patients`);
  },
};
