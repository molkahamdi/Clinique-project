import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { Patient } from '../users/entities/patient.entity';
import { Doctor } from '../users/entities/doctor.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AgendaService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    console.log('📋 Création d\'un rendez-vous avec les données:', createAppointmentDto);

    // Convertir la date string en Date object
    const appointmentDate = new Date(createAppointmentDto.date);

    // Chercher ou créer le patient
    let patient = await this.patientRepo.findOne({ 
      where: { email: createAppointmentDto.email } 
    });

    if (!patient) {
      console.log('👤 Création d\'un nouveau patient');
      patient = this.patientRepo.create({
        firstName: createAppointmentDto.patient.split(' ')[0],
        lastName: createAppointmentDto.patient.split(' ').slice(1).join(' '),
        email: createAppointmentDto.email,
        phone: createAppointmentDto.phone,
        address: createAppointmentDto.address,
        role: 'patient' as any,
        password: 'temporary_password',
      });
      patient = await this.patientRepo.save(patient);
    }

    // Trouver un docteur disponible (premier docteur trouvé)
    const doctor = await this.doctorRepo.findOne({ where: {} });
    if (!doctor) {
      throw new NotFoundException('Aucun docteur disponible');
    }

    // Créer le rendez-vous
    const appointment = this.appointmentRepo.create({
      date: appointmentDate,
      time: this.formatTime(appointmentDate),
      reason: createAppointmentDto.type,
      patientId: patient.id,
      doctorId: doctor.id,
      status: AppointmentStatus.PENDING,
    });

    const savedAppointment = await this.appointmentRepo.save(appointment);
    console.log('✅ Rendez-vous créé avec succès:', savedAppointment.id);
    return savedAppointment;
  }

  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepo.find({
      relations: ['patient', 'doctor'],
      order: { date: 'ASC', time: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['patient', 'doctor']
    });
    
    if (!appointment) {
      throw new NotFoundException(`Rendez-vous avec l'ID ${id} non trouvé`);
    }
    
    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    
    // Mettre à jour les champs
    if (updateAppointmentDto.date) {
      const updatedDate = new Date(updateAppointmentDto.date);
      appointment.date = updatedDate;
      appointment.time = this.formatTime(updatedDate);
    }
    if (updateAppointmentDto.type) {
      appointment.reason = updateAppointmentDto.type;
    }

    const updatedAppointment = await this.appointmentRepo.save(appointment);
    console.log('✏️ Rendez-vous mis à jour:', updatedAppointment.id);
    return updatedAppointment;
  }

  async remove(id: string): Promise<void> {
    const result = await this.appointmentRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Rendez-vous avec l'ID ${id} non trouvé`);
    }
    console.log('🗑️ Rendez-vous supprimé:', id);
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}