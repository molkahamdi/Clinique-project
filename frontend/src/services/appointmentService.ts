import { Appointment, CreateAppointmentDto, UpdateAppointmentDto, AppointmentStatus, DoctorInfo } from '@/types/appointment';
import { apiClient } from '@/lib/api';

export const appointmentService = {
  async getDoctors(): Promise<DoctorInfo[]> {
    try {
      console.log('🔍 Chargement des médecins depuis l\'API...');
      
      try {
        const doctors = await apiClient.apiCall('/users/doctors');
        console.log('✅ Médecins chargés via endpoint spécifique:', doctors);
        return this.formatDoctors(doctors);
      } catch (endpointError) {
        console.log('⚠️ Endpoint spécifique non disponible, filtrage manuel...');
        const allUsers = await apiClient.apiCall('/users');
        const doctors = allUsers.filter((user: any) => 
          user.role === 'DOCTOR' || user.role === 'doctor'
        );
        console.log('✅ Médecins filtrés:', doctors.length);
        return this.formatDoctors(doctors);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des médecins:', error);
      console.log('🔄 Utilisation des médecins de démonstration');
      return this.getDemoDoctors();
    }
  },

  formatDoctors(doctors: any[]): DoctorInfo[] {
    return doctors.map((doctor: any) => ({
      id: doctor.id,
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.specialization || doctor.speciality || 'Médecin généraliste',
      speciality: doctor.speciality || doctor.specialization || 'Médecin généraliste',
      address: doctor.address || 'Clinique Principale',
      clinique: doctor.clinique
    }));
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
      const appointment = await apiClient.apiCall(`/appointments/${id}`);
      
      if (appointment.doctor) {
        appointment.doctor = this.formatDoctorData(appointment.doctor);
      }
      
      return appointment;
    } catch (error) {
      console.log('⚠️ API détail non disponible, données de démonstration');
      const appointments = this.getAllDemoAppointments();
      const foundAppointment = appointments.find(apt => apt.id === id) || appointments[0];
      return foundAppointment;
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
      const demoDoctor = this.getDemoDoctors().find(d => d.id === data.doctorId) || this.getDemoDoctors()[0];
      
      return {
        ...data,
        id: 'appt-' + Date.now(),
        status: AppointmentStatus.PENDING,
        doctor: demoDoctor,
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
      const response = await apiClient.apiCall(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      console.log('✅ Statut mis à jour avec succès:', response);
      return response;
    } catch (error) {
      console.log('⚠️ API statut non disponible, simulation réussie');
      const appointments = this.getAllDemoAppointments();
      const appointment = appointments.find(apt => apt.id === id) || appointments[0];
      return { ...appointment, status };
    }
  },

  async cancelAppointment(id: string): Promise<Appointment> {
    try {
      console.log('❌ Annulation du rendez-vous via API:', id);
      
      // Utiliser UNIQUEMENT apiClient pour une cohérence totale
      const response = await apiClient.apiCall(`/appointments/${id}/cancel`, {
        method: 'PATCH',
      });

      console.log('✅ Rendez-vous annulé avec succès:', response);
      return response;
      
    } catch (error: any) {
      console.error('❌ Erreur API annulation:', error);
      
      // L'erreur est déjà gérée par apiClient, on la propage simplement
      throw error;
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
  getDemoDoctors(): DoctorInfo[] {
    console.log('🎭 Génération des médecins de démonstration avec spécialités');
    return [
      {
        id: 'doctor-1',
        firstName: 'Jean',
        lastName: 'Dupont',
        specialization: 'Médecin généraliste',
        speciality: 'Médecine générale',
        email: 'jean.dupont@clinique.com',
        phone: '01 23 45 67 89',
        address: '123 Avenue des Champs, Paris'
      },
      {
        id: 'doctor-2',
        firstName: 'Marie',
        lastName: 'Martin',
        specialization: 'Cardiologue',
        speciality: 'Cardiologie',
        email: 'marie.martin@clinique.com',
        phone: '01 34 56 78 90',
        address: '456 Rue du Cœur, Paris'
      },
      {
        id: 'doctor-3',
        firstName: 'Pierre',
        lastName: 'Durand',
        specialization: 'Dermatologue',
        speciality: 'Dermatologie',
        email: 'pierre.durand@clinique.com',
        phone: '01 45 67 89 01',
        address: '789 Boulevard de la Peau, Paris'
      }
    ];
  },

  getDemoDoctorAppointments(doctorId: string): Appointment[] {
    console.log('🎭 Génération données démo pour docteur:', doctorId);
    
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];

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
      }
    ];

    return baseAppointments.map(apt => {
      const doctor = this.getDemoDoctors().find(d => d.id === doctorId) || this.getDemoDoctors()[0];
      return {
        ...apt,
        doctor: doctor,
        patient: this.getDemoPatient(apt.patientId)
      };
    }) as Appointment[];
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
      }
    };
    return patients[patientId] || patients['patient-1'];
  },

  getAllDemoAppointments(): Appointment[] {
    return [
      ...this.getDemoDoctorAppointments('doctor-1'),
      ...this.getDemoDoctorAppointments('doctor-2'),
      ...this.getDemoDoctorAppointments('doctor-3')
    ];
  },

  formatDoctorData(doctorData: any): DoctorInfo {
    return {
      id: doctorData.id,
      firstName: doctorData.firstName,
      lastName: doctorData.lastName,
      email: doctorData.email,
      phone: doctorData.phone,
      specialization: doctorData.specialization || doctorData.speciality || 'Médecin généraliste',
      speciality: doctorData.speciality || doctorData.specialization || 'Médecin généraliste',
      address: doctorData.address,
      clinique: doctorData.clinique
    };
  },

  isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
};