import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Invoice } from "./entities/invoice.entity";
import { Appointment } from "src/appointments/entities/appointment.entity";
import { InvoicesService } from "./invoices.service";
import { InvoicesController } from "./invoices.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, Appointment])],
  providers: [InvoicesService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
