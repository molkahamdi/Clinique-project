import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AgendaService } from './agenda.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Post()
  create(@Body() dto: CreateAppointmentDto) {
    console.log('📥 Données reçues du frontend :', dto);
    return this.agendaService.create(dto);
  }

  @Get()
  findAll() {
    return this.agendaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agendaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAppointmentDto) {
    return this.agendaService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agendaService.remove(id);
  }
}