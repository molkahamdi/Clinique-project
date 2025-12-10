import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepo: Repository<Appointment>,
    
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const appointment = this.appointmentRepo.create(createAppointmentDto);
    return await this.appointmentRepo.save(appointment);
  }

  async findByPatientId(patientId: string): Promise<Appointment[]> {
    return await this.appointmentRepo.find({
      where: { patientId: patientId },
      relations: ['doctor', 'patient'],
      order: { date: 'DESC', time: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id: id },
      relations: ['doctor', 'patient']
    });
    
    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
    
    return appointment;
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);
    
    // Vérifier si on tente de modifier un rendez-vous annulé
    if (appointment.status === AppointmentStatus.CANCELLED && 
        updateAppointmentDto.status !== AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Impossible de modifier un rendez-vous annulé');
    }

    await this.appointmentRepo.update(id, updateAppointmentDto);
    const updatedAppointment = await this.findOne(id);
    return updatedAppointment;
  }

  async cancel(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    
    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Ce rendez-vous est déjà annulé');
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Impossible d\'annuler un rendez-vous déjà terminé');
    }

    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const now = new Date();
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      throw new BadRequestException('L\'annulation doit être effectuée au moins 24 heures avant le rendez-vous');
    }

    
    await this.appointmentRepo.update(id, { 
      status: AppointmentStatus.CANCELLED
    });
    
    const cancelledAppointment = await this.findOne(id);
    return cancelledAppointment;
  }

  async remove(id: string): Promise<void> {
    const result = await this.appointmentRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
  }


  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepo.find({
      relations: ['doctor', 'patient'],
      order: { date: 'DESC', time: 'DESC' }
    });
  }

  async confirm(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    
    if (appointment.status !== AppointmentStatus.PENDING) {
      throw new BadRequestException('Seuls les rendez-vous en attente peuvent être confirmés');
    }

    await this.appointmentRepo.update(id, { 
      status: AppointmentStatus.CONFIRMED
    });
    
    return await this.findOne(id);
  }

  async complete(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    
    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Impossible de terminer un rendez-vous annulé');
    }

    await this.appointmentRepo.update(id, { 
      status: AppointmentStatus.COMPLETED
    });
    
    return await this.findOne(id);
  }

async findByDoctorId(doctorId: string): Promise<Appointment[]> {
  return await this.appointmentRepo.find({
    where: { 
      doctorId: doctorId,
      status: AppointmentStatus.CONFIRMED, 
    },
    relations: ['doctor', 'patient'],
    order: { date: 'ASC', time: 'ASC' }
  });
}


}