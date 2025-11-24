import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  findAll() {
    throw new Error('Method not implemented.');
  }
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
    await this.appointmentRepo.update(id, updateAppointmentDto);
    const updatedAppointment = await this.findOne(id);
    return updatedAppointment;
  }

  async cancel(id: string): Promise<Appointment> {
    await this.appointmentRepo.update(id, { status: AppointmentStatus.CANCELLED });
    const cancelledAppointment = await this.findOne(id);
    return cancelledAppointment;
  }

  async remove(id: string): Promise<void> {
    const result = await this.appointmentRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }
  }
}