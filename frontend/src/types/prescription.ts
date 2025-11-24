export interface PrescriptionItem {
  urgent: unknown;
  id?: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  date: string;
  patientId?: string;
  consultationId?: string;
  items: PrescriptionItem[];
  notes?: string;
  doctorName: string;
  doctorSpecialty?: string;
  
  // Informations patient (soit via relation, soit manuelles)
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phone?: string;
  };
  
  // Informations patient manuelles
  patientFirstName?: string;
  patientLastName?: string;
  patientDateOfBirth?: string;
  patientPhone?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrescriptionDto {
  date: string;
  patientId?: string;
  
  // Informations patient manuelles (alternatives)
  patientFirstName?: string;
  patientLastName?: string;
  patientDateOfBirth?: string;
  patientPhone?: string;
  
  consultationId?: string;
  items: Omit<PrescriptionItem, 'id'>[];
  notes?: string;
  doctorName: string;
  doctorSpecialty?: string;
}