export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export interface DoctorInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization?: string;
  speciality?: string;
  phone?: string;
  address?: string;
  clinique?: any;
}

export interface PatientInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  patientId: string;
  doctorId: string;
  doctor?: DoctorInfo;
  patient?: PatientInfo;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentDto {
  date: string;
  time: string;
  reason: string;
  doctorId: string;
  patientId: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  date?: string;
  time?: string;
  reason?: string;
  status?: AppointmentStatus;
  notes?: string;
}