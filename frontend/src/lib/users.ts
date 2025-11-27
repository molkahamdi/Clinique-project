// src/lib/users.ts
import { apiClient } from "./api";

export interface SimpleUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
}

// ----------------------------
// GET ALL PATIENTS
// ----------------------------
export async function getAllPatients(): Promise<SimpleUser[]> {
  return await apiClient.apiCall("/users?role=patient", {
    method: "GET",
  });
}

// ----------------------------
// GET ALL DOCTORS
// ----------------------------
export async function getAllDoctors(): Promise<SimpleUser[]> {
  return await apiClient.apiCall("/users?role=doctor", {
    method: "GET",
  });
}
