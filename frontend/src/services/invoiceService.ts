import { apiClient } from "@/lib/api";

class InvoiceService {

  // ✅ Create an invoice for a specific appointment
  async createInvoice(appointmentId: string, data: {
    consultationFee: number;
    tax: number;
    totalFinal: number;
    notes?: string;
    paymentMethod?: string;
  }) {
    return apiClient.apiCall(`/invoices/${appointmentId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // ✅ Get all invoices for a specific patient
  async getPatientInvoices(patientId: string) {
  return apiClient.apiCall(`/invoices/patient/${patientId}`, {
    method: "GET",
  });
}

  // ✅ Get invoice by invoiceId
  async getInvoiceById(invoiceId: string) {
    return apiClient.apiCall(`/invoices/${invoiceId}`, {
      method: "GET",
    });
  }

  // ✅ Get invoice using appointmentId (one appointment = one invoice)
  async getInvoiceByAppointment(appointmentId: string) {
    return apiClient.apiCall(`/invoices/by-appointment/${appointmentId}`, {
      method: "GET",
    });
  }
}

export const invoiceService = new InvoiceService();
