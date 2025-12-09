import { Controller, Post, Param, Body, Get } from "@nestjs/common";
import { InvoicesService } from "./invoices.service";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";

@Controller("invoices")
export class InvoicesController {
  constructor(private readonly invoiceService: InvoicesService) {}

  @Post(":appointmentId")
  createInvoice(
    @Param("appointmentId") appointmentId: string,
    @Body() dto: CreateInvoiceDto
  ) {
    return this.invoiceService.createInvoice(appointmentId, dto);
  }

  // ✅ NEW ROUTE: Get invoice from appointmentId
  @Get("by-appointment/:appointmentId")
  getInvoiceByAppointment(@Param("appointmentId") appointmentId: string) {
    return this.invoiceService.getInvoiceByAppointment(appointmentId);
  }

  @Get("test")
  test() {
  return "Invoices module is loaded!";
}

@Get(":invoiceId")
getInvoiceById(@Param("invoiceId") invoiceId: string) {
  return this.invoiceService.getInvoiceById(invoiceId);
}

// @Get("patient/:patientId")
// async getByPatient(@Param("patientId") patientId: string) {
//   return this.invoiceService.getInvoicesByPatient(patientId);
// }

@Get('patient/:patientId')
async getInvoicesByPatient(@Param('patientId') patientId: string) {
  return this.invoiceService.getInvoicesByPatient(patientId);
}

@Post("pay/:invoiceId")
createPayment(@Param("invoiceId") invoiceId: string) {
  return this.invoiceService.createPaymentSession(invoiceId);
}



}