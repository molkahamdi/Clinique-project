// services/appointmentService.ts
import {
  Appointment,
  CreateAppointmentDto,
  UpdateAppointmentDto,
  AppointmentStatus,
  DoctorInfo,
} from '@/types/appointment';
import { apiClient } from '@/lib/api';

export const appointmentService = {
  // ============================================================
  // 🔹 DOCTORS (real DB only)
  // ============================================================
  async getDoctors(): Promise<DoctorInfo[]> {
    console.log('🔍 Loading doctors from API...');
    const doctors = await apiClient.apiCall('/users/doctors');
    return this.formatDoctors(doctors);
  },

  formatDoctors(doctors: any[]): DoctorInfo[] {
    return doctors.map((doctor: any) => ({
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      phone: doctor.phone,
      specialization:
        doctor.specialization || doctor.speciality || 'Médecin généraliste',
      speciality:
        doctor.speciality || doctor.specialization || 'Médecin généraliste',
      address: doctor.address || 'Clinique',
      clinique: doctor.clinique,
    }));
  },

  // ============================================================
  // 🔹 APPOINTMENTS (real DB only)
  // ============================================================
  async getAppointments(): Promise<Appointment[]> {
    console.log('🔍 Fetching all appointments...');
    return await apiClient.apiCall('/appointments');
  },

  async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    console.log('🔍 Fetching appointments for doctor:', doctorId);
    return await apiClient.apiCall(`/appointments/doctor/${doctorId}`);
  },

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    console.log('🔍 Fetching appointments for patient:', patientId);
    return await apiClient.apiCall(`/appointments/patient/${patientId}`);
  },

  async getAppointment(id: string): Promise<Appointment> {
    console.log('🔍 Fetching appointment details:', id);
    const appointment = await apiClient.apiCall(`/appointments/${id}`);

    if (appointment.doctor) {
      appointment.doctor = this.formatDoctorData(appointment.doctor);
    }

    return appointment;
  },

  // ============================================================
  // 🔹 CRUD OPERATIONS (real DB only)
  // ============================================================
  async createAppointment(data: CreateAppointmentDto): Promise<Appointment> {
    console.log('📋 Creating appointment:', data);
    return await apiClient.apiCall('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus
  ): Promise<Appointment> {
    console.log('🔄 Updating appointment status:', id, status);
    return await apiClient.apiCall(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async cancelAppointment(id: string): Promise<Appointment> {
    console.log('❌ Cancelling appointment:', id);
    return await apiClient.apiCall(`/appointments/${id}/cancel`, {
      method: 'PATCH',
    });
  },

  async deleteAppointment(id: string): Promise<void> {
    console.log('🗑 Deleting appointment:', id);
    await apiClient.apiCall(`/appointments/${id}`, {
      method: 'DELETE',
    });
  },

  // ============================================================
  // 🔹 Formatting
  // ============================================================
  formatDoctorData(doctorData: any): DoctorInfo {
    return {
      id: doctorData.id,
      firstName: doctorData.firstName,
      lastName: doctorData.lastName,
      email: doctorData.email,
      phone: doctorData.phone,
      specialization:
        doctorData.specialization || doctorData.speciality || 'Médecin généraliste',
      speciality:
        doctorData.speciality || doctorData.specialization || 'Médecin généraliste',
      address: doctorData.address,
      clinique: doctorData.clinique,
    };
  },
};
