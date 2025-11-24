import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { CliniqueModule } from './clinique/clinique.module';
import { ConsultationsModule } from './consultations/consultations.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { AgendaModule } from './agenda/agenda.module';
import { RdvModule } from './rdv/rdv.module';
import { MedicalServicesModule } from './medical-services/medical-services.module';
import { EquipmentModule } from './equipment/equipment.module';
import { MedicationsModule } from './medications/medications.module';
import { AppointmentsModule } from './appointments/appointments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CliniqueModule,
    ConsultationsModule,
    PrescriptionsModule,
    AgendaModule,
    RdvModule,
    MedicalServicesModule,
    EquipmentModule,
    MedicationsModule,
    AppointmentsModule,
 
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
