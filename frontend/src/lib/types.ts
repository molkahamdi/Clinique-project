//apartient au crud des utilisateurs
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  RECEP = 'receptionist',
  DOCTOR = 'doctor',
  PATIENT = 'patient',
}

export interface User {
  isActive: boolean;
  avatar: string | Blob | undefined;
  createdAt: any;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  speciality?: string;
  clinique?: any; // Pour les docteurs et réceptionnistes
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  role: UserRole;
  speciality?: string;
  cliniqueId?: string; // Optionnel pour l'assignation à une clinique
}
