import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Invoice } from "./entities/invoice.entity";
import { Appointment } from "src/appointments/entities/appointment.entity";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,

    @InjectRepository(Appointment)
    private apptRepo: Repository<Appointment>,
  ) {}

  async createInvoice(appointmentId: string, dto: CreateInvoiceDto) {
  const appointment = await this.apptRepo.findOne({
    where: { id: appointmentId },
    relations: ["patient", "doctor"],
  });

  if (!appointment) {
    throw new NotFoundException("Appointment not found");
  }

  // Convert string → number or DB will crash
  const fee = Number(dto.consultationFee) || 0;
  const tax = Number(dto.tax) || 0;
  const total = Number(dto.totalFinal) || fee + tax;

  const invoice = this.invoiceRepo.create({
    consultationFee: fee,
    tax: tax,
    totalFinal: total,
    paymentMethod: dto.paymentMethod || "cash",
    notes: dto.notes || "",
    invoiceNumber: "INV-" + Date.now(),
    invoiceDate: new Date().toISOString().split("T")[0],
    appointment,
  });

  return await this.invoiceRepo.save(invoice);
}


  async getInvoiceByAppointment(appointmentId: string) {
  const invoice = await this.invoiceRepo.findOne({
    where: { appointment: { id: appointmentId } },
    relations: ["appointment", "appointment.patient", "appointment.doctor"],
  });

  if (!invoice) {
    throw new NotFoundException("Aucune facture trouvée pour ce rendez-vous.");
  }

  return invoice;
}

async getInvoiceById(invoiceId: string) {
  const invoice = await this.invoiceRepo.findOne({
    where: { id: invoiceId },
    relations: ["appointment", "appointment.patient", "appointment.doctor"],
  });

  if (!invoice) {
    throw new NotFoundException("Invoice not found");
  }

  return invoice;
}


}
