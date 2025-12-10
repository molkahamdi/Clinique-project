import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Invoice } from "./entities/invoice.entity";
import { Appointment } from "src/appointments/entities/appointment.entity";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";
import Stripe from "stripe";

@Injectable()
export class InvoicesService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Invoice)
    private invoiceRepo: Repository<Invoice>,

    @InjectRepository(Appointment)
    private apptRepo: Repository<Appointment>,
  ) {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      throw new Error("❌ STRIPE_SECRET_KEY is missing in .env");
    }

    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-11-17.clover" as any,
    });
  }

  // -----------------------------------------------------
  // CREATE INVOICE
  // -----------------------------------------------------
  async createInvoice(appointmentId: string, dto: CreateInvoiceDto) {
    const appointment = await this.apptRepo.findOne({
      where: { id: appointmentId },
      relations: ["patient", "doctor"],
    });

    if (!appointment) {
      throw new NotFoundException("Appointment not found");
    }

    const fee = Number(dto.consultationFee) || 0;
    const tax = Number(dto.tax) || 0;
    const total = Number(dto.totalFinal) || fee + tax;

    const invoice = this.invoiceRepo.create({
      consultationFee: fee,
      tax: tax,
      totalFinal: total,
      paymentMethod: dto.paymentMethod || "card",
      notes: dto.notes || "",
      invoiceNumber: "INV-" + Date.now(),
      invoiceDate: new Date().toISOString().split("T")[0],
      appointment,
    });

    return await this.invoiceRepo.save(invoice);
  }

  // -----------------------------------------------------
  // GET INVOICE BY APPOINTMENT
  // -----------------------------------------------------
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

  // -----------------------------------------------------
  // GET INVOICE BY ID
  // -----------------------------------------------------
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

  // -----------------------------------------------------
  // GET ALL INVOICES FOR A PATIENT
  // -----------------------------------------------------
  async getInvoicesByPatient(patientId: string) {
    return this.invoiceRepo.find({
      where: {
        appointment: {
          patient: { id: patientId },
        },
      },
      relations: ["appointment", "appointment.patient", "appointment.doctor"],
      order: { invoiceDate: "DESC" },
    });
  }

  // -----------------------------------------------------
  // STRIPE CHECKOUT SESSION
  // -----------------------------------------------------
  async createPaymentSession(invoiceId: string) {
    const invoice = await this.invoiceRepo.findOne({
      where: { id: invoiceId },
      relations: ["appointment", "appointment.patient", "appointment.doctor"],
    });

    if (!invoice) {
      throw new NotFoundException("Invoice not found");
    }

    const currency = "usd";

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: `Facture #${invoice.invoiceNumber}`,
            },
            unit_amount: Math.round(invoice.totalFinal * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/invoice/${invoice.id}?status=success`,
      cancel_url: `${process.env.FRONTEND_URL}/invoice/${invoice.id}?status=cancel`,
    });

    return { url: session.url };
  }
}
