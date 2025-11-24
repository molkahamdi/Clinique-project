// types/appointment.ts
export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  patientId: string;
  doctorId: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  
  // Relations (peuvent être optionnelles selon le contexte)
  doctor?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    specialization?: string;
  };
  
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
  };
}

export interface CreateAppointmentDto {
  date: string;
  time: string;
  reason: string;
  patientId: string;
  doctorId: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  date?: string;
  time?: string;
  reason?: string;
  status?: AppointmentStatus;
  notes?: string;
}