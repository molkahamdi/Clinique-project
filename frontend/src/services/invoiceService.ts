import { apiClient } from "@/lib/api";

class InvoiceService {
  async createInvoice(data: {
    appointmentId: string;
    amount: number;
    description: string;
    paymentMethod: string;
    receptionistId: string;
  }) {
    return apiClient.apiCall("/invoices", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}

export const invoiceService = new InvoiceService();
