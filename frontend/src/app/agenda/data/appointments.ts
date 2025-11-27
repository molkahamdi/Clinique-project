// src/app/agenda/data/appointments.ts
import axios from "axios";
import { Appointment, CreateAppointmentDto, UpdateAppointmentDto } from "@/types/appointment";

// -------------------------------
// 1️⃣ Load token from localStorage
// -------------------------------
function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");   // <-- The SAME token used in receptionist dashboard
}

// --------------------------------------------
// 2️⃣ Axios instance WITH Authorization header
// --------------------------------------------
const api = axios.create({
  baseURL: "http://localhost:3001",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("❌ API ERROR:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data || error.message,
    });
    throw error;
  }
);

// -------------------------------
// 3️⃣ GET appointments
// -------------------------------
export async function getAppointments(): Promise<Appointment[]> {
  const res = await api.get("/appointments");
  return res.data;
}

// -------------------------------
// 4️⃣ CREATE appointment
// -------------------------------
export async function createAppointment(data: CreateAppointmentDto) {
  const res = await api.post("/appointments", data);
  return res.data;
}

// -------------------------------
// 5️⃣ UPDATE appointment
// -------------------------------
export async function updateAppointment(id: string, data: UpdateAppointmentDto) {
  const res = await api.patch(`/appointments/${id}`, data);
  return res.data;
}

// -------------------------------
// 6️⃣ DELETE appointment
// -------------------------------
export async function deleteAppointment(id: string) {
  const res = await api.delete(`/appointments/${id}`);
  return res.data;
}
