// services/appointmentService.ts
import { Appointment, CreateAppointmentDto, UpdateAppointmentDto, AppointmentStatus } from '@/types/appointment';
import { apiClient } from '@/lib/api';

export interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
}

export const appointmentService = {
  // NOUVELLE MÉTHODE : Récupération des médecins
  async getDoctors(): Promise<Doctor[]> {
    try {
      console.log('🔍 Chargement des médecins...');
      const doctors = await apiClient.apiCall('/users?role=doctor');
      console.log('✅ Médecins chargés via API:', doctors.length);
      return doctors;
    } catch (error) {
      console.error('❌ Erreur lors du chargement des médecins:', error);
      console.log('🔄 Utilisation des médecins de démonstration');
      return this.getDemoDoctors();
    }
  },

  async getDoctorAppointments(doctorId: string): Promise<Appointment[]> {
    try {
      console.log('🔍 Chargement des rendez-vous du docteur:', doctorId);
      const appointments = await apiClient.apiCall(`/appointments/doctor/${doctorId}`);
      console.log('✅ Rendez-vous du docteur chargés:', appointments.length);
      return appointments;
    } catch (error: any) {
      console.log('⚠️ API docteur non disponible, utilisation données démo');
      return this.getDemoDoctorAppointments(doctorId);
    }
  },

  async getAppointments(): Promise<Appointment[]> {
    try {
      console.log('🔍 Chargement de tous les rendez-vous...');
      const appointments = await apiClient.apiCall('/appointments');
      return appointments;
    } catch (error: any) {
      console.log('⚠️ API rendez-vous non disponible');
      return this.getAllDemoAppointments();
    }
  },

  async getPatientAppointments(patientId: string): Promise<Appointment[]> {
    try {
      console.log('🔍 Chargement des rendez-vous patient:', patientId);
      const response = await apiClient.apiCall(`/appointments/patient/${patientId}`);
      return response;
    } catch (error) {
      console.log('⚠️ API patient non disponible, données de démonstration');
      return this.getAllDemoAppointments().filter(apt => apt.patientId === patientId);
    }
  },

  async getAppointment(id: string): Promise<Appointment> {
    try {
      return await apiClient.apiCall(`/appointments/${id}`);
    } catch (error) {
      console.log('⚠️ API détail non disponible, données de démonstration');
      const appointments = this.getAllDemoAppointments();
      return appointments.find(apt => apt.id === id) || appointments[0];
    }
  },

  async createAppointment(data: CreateAppointmentDto): Promise<Appointment> {
    try {
      console.log('📋 Création rendez-vous via API:', data);
      const response = await apiClient.apiCall('/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response;
    } catch (error) {
      console.log('⚠️ API création non disponible, simulation réussie');
      return {
        ...data,
        id: 'appt-' + Date.now(),
        status: AppointmentStatus.PENDING,
        doctor: this.getDemoDoctors().find(d => d.id === data.doctorId) || this.getDemoDoctors()[0],
        patient: {
          id: data.patientId,
          firstName: 'Patient',
          lastName: 'Simulé',
          email: 'patient@demo.com'
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as Appointment;
    }
  },

  async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    try {
      return await apiClient.apiCall(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.log('⚠️ API statut non disponible, simulation réussie');
      const appointments = this.getAllDemoAppointments();
      const appointment = appointments.find(apt => apt.id === id) || appointments[0];
      return { ...appointment, status };
    }
  },

  async cancelAppointment(id: string): Promise<Appointment> {
    try {
      console.log('❌ Annulation du rendez-vous:', id);
      return await this.updateAppointmentStatus(id, AppointmentStatus.CANCELLED);
    } catch (error) {
      console.log('⚠️ API annulation non disponible, simulation réussie');
      const appointments = this.getAllDemoAppointments();
      const appointment = appointments.find(apt => apt.id === id) || appointments[0];
      return { ...appointment, status: AppointmentStatus.CANCELLED };
    }
  },

  async deleteAppointment(id: string): Promise<void> {
    try {
      await apiClient.apiCall(`/appointments/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.log('⚠️ API suppression non disponible, simulation réussie');
      return;
    }
  },

  // Médecins de démonstration
  getDemoDoctors(): Doctor[] {
    console.log('🎭 Génération des médecins de démonstration');
    return [
      {
        id: 'doctor-1',
        firstName: 'Jean',
        lastName: 'Dupont',
        specialization: 'Médecin généraliste',
        email: 'jean.dupont@clinique.com',
        phone: '01 23 45 67 89',
        address: '123 Avenue des Champs, Paris'
      },
      {
        id: 'doctor-2',
        firstName: 'Marie',
        lastName: 'Martin',
        specialization: 'Cardiologue',
        email: 'marie.martin@clinique.com',
        phone: '01 34 56 78 90',
        address: '456 Rue du Cœur, Paris'
      },
      {
        id: 'doctor-3',
        firstName: 'Pierre',
        lastName: 'Durand',
        specialization: 'Dermatologue',
        email: 'pierre.durand@clinique.com',
        phone: '01 45 67 89 01',
        address: '789 Boulevard de la Peau, Paris'
      },
      {
        id: 'doctor-4',
        firstName: 'Sophie',
        lastName: 'Laurent',
        specialization: 'Pédiatre',
        email: 'sophie.laurent@clinique.com',
        phone: '01 56 78 90 12',
        address: '321 Rue des Enfants, Paris'
      },
      {
        id: 'doctor-5',
        firstName: 'Luc',
        lastName: 'Moreau',
        specialization: 'Gynécologue',
        email: 'luc.moreau@clinique.com',
        phone: '01 67 89 01 23',
        address: '654 Avenue des Femmes, Paris'
      }
    ];
  },

  // Données de démonstration pour un docteur spécifique
  getDemoDoctorAppointments(doctorId: string): Appointment[] {
    console.log('🎭 Génération données démo pour docteur:', doctorId);
    
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dayAfterTomorrow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const baseAppointments = [
      {
        id: 'appt-1',
        date: today,
        time: '09:00',
        reason: 'Consultation générale',
        status: AppointmentStatus.CONFIRMED,
        patientId: 'patient-1',
        doctorId: doctorId,
        notes: 'Contrôle routine',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'appt-2',
        date: today,
        time: '10:30',
        reason: 'Suivi traitement',
        status: AppointmentStatus.PENDING,
        patientId: 'patient-2',
        doctorId: doctorId,
        notes: 'Nouveau médicament à prescrire',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'appt-3',
        date: today,
        time: '14:00',
        reason: 'Première visite',
        status: AppointmentStatus.CONFIRMED,
        patientId: 'patient-3',
        doctorId: doctorId,
        notes: 'Nouveau patient',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'appt-4',
        date: tomorrow,
        time: '11:00',
        reason: 'Vaccination',
        status: AppointmentStatus.CONFIRMED,
        patientId: 'patient-4',
        doctorId: doctorId,
        notes: 'Rappel vaccinal',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'appt-5',
        date: dayAfterTomorrow,
        time: '16:30',
        reason: 'Bilan annuel',
        status: AppointmentStatus.PENDING,
        patientId: 'patient-5',
        doctorId: doctorId,
        notes: 'Bilan complet demandé',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    // Ajouter les informations patients et docteur
    return baseAppointments.map(apt => ({
      ...apt,
      doctor: this.getDemoDoctors().find(d => d.id === doctorId) || this.getDemoDoctors()[0],
      patient: this.getDemoPatient(apt.patientId)
    })) as Appointment[];
  },

  getDemoPatient(patientId: string) {
    const patients: Record<string, any> = {
      'patient-1': { 
        id: 'patient-1', 
        firstName: 'Marie', 
        lastName: 'Martin', 
        email: 'marie.martin@email.com', 
        phone: '01 23 45 67 89',
        dateOfBirth: '1985-03-15'
      },
      'patient-2': { 
        id: 'patient-2', 
        firstName: 'Pierre', 
        lastName: 'Durand', 
        email: 'pierre.durand@email.com', 
        phone: '01 34 56 78 90',
        dateOfBirth: '1978-07-22'
      },
      'patient-3': { 
        id: 'patient-3', 
        firstName: 'Sophie', 
        lastName: 'Laurent', 
        email: 'sophie.laurent@email.com', 
        phone: '01 45 67 89 01',
        dateOfBirth: '1990-11-30'
      },
      'patient-4': { 
        id: 'patient-4', 
        firstName: 'Luc', 
        lastName: 'Moreau', 
        email: 'luc.moreau@email.com', 
        phone: '01 56 78 90 12',
        dateOfBirth: '1982-05-18'
      },
      'patient-5': { 
        id: 'patient-5', 
        firstName: 'Alice', 
        lastName: 'Petit', 
        email: 'alice.petit@email.com', 
        phone: '01 67 89 01 23',
        dateOfBirth: '1975-12-08'
      }
    };
    return patients[patientId] || patients['patient-1'];
  },

  getAllDemoAppointments(): Appointment[] {
    // Retourne tous les rendez-vous de démonstration
    return [
      ...this.getDemoDoctorAppointments('doctor-1'),
      ...this.getDemoDoctorAppointments('doctor-2'),
      ...this.getDemoDoctorAppointments('doctor-3')
    ];
  },

  // Fonction utilitaire pour valider les UUID
  isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
};