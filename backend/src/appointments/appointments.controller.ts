import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseUUIDPipe
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from 'src/auth/guard/auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { userRole } from 'src/users/entities/user.entity';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(userRole.PATIENT, userRole.RECEP)
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get('patient/:patientId')
  @Roles(userRole.PATIENT, userRole.DOCTOR, userRole.ADMIN, userRole.RECEP)
  findByPatientId(@Param('patientId', ParseUUIDPipe) patientId: string) {
    return this.appointmentsService.findByPatientId(patientId);
  }

  // ✅ CORRECT SINGLE ROUTE FOR DOCTOR
  @Get('doctor/:doctorId')
  @Roles(userRole.DOCTOR, userRole.ADMIN, userRole.RECEP)
  getDoctorAppointments(@Param('doctorId') doctorId: string) {
    return this.appointmentsService.findByDoctorId(doctorId);
  }

  @Get()
  @Roles(userRole.DOCTOR, userRole.ADMIN, userRole.RECEP)
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  @Roles(userRole.PATIENT, userRole.DOCTOR, userRole.ADMIN, userRole.RECEP)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(userRole.PATIENT, userRole.DOCTOR, userRole.ADMIN, userRole.RECEP)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Patch(':id/cancel')
  @Roles(userRole.PATIENT, userRole.DOCTOR, userRole.ADMIN, userRole.RECEP)
  cancel(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.cancel(id);
  }

  @Delete(':id')
  @Roles(userRole.ADMIN, userRole.RECEP)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.appointmentsService.remove(id);
  }
}
