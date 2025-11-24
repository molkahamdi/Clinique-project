import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgendaService } from './agenda.service';
import { AgendaController } from './agenda.controller';
import { Appointment } from './entities/appointment.entity';
import { Patient } from '../users/entities/patient.entity';
import { Doctor } from '../users/entities/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Patient, Doctor])
  ],
  controllers: [AgendaController],
  providers: [AgendaService],
})
export class AgendaModule {}