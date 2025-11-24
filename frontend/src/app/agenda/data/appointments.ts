import axios from "axios";
import { Appointment } from "@/types/appointment";

// URL de base avec gestion des environnements
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const API_URL = `${API_BASE_URL}/appointments`;

// Configuration axios avec timeout et gestion d'erreurs
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour logger les requêtes
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Requête API: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erreur requête API:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Réponse API: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Erreur réponse API:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.message,
    });
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Serveur inaccessible. Vérifiez que le backend est démarré sur le port 3001.');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
    }
    
    throw error;
  }
);

export const getAppointments = async (): Promise<Appointment[]> => {
  try {
    const res = await api.get<Appointment[]>("/appointments");
    return res.data;
  } catch (error: any) {
    console.error('❌ Erreur getAppointments:', error);
    throw new Error(error.message || 'Impossible de charger les rendez-vous');
  }
};

export const createAppointment = async (appt: Omit<Appointment, "id">): Promise<Appointment> => {
  try {
    const res = await api.post<Appointment>("/appointments", appt);
    return res.data;
  } catch (error: any) {
    console.error('❌ Erreur createAppointment:', error);
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    throw new Error(error.message || 'Erreur lors de la création du rendez-vous');
  }
};

export const updateAppointment = async (id: string, appt: Partial<Appointment>): Promise<Appointment> => {
  try {
    const res = await api.patch<Appointment>(`/appointments/${id}`, appt);
    return res.data;
  } catch (error: any) {
    console.error('❌ Erreur updateAppointment:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Rendez-vous non trouvé');
    }
    
    throw new Error(error.message || 'Erreur lors de la modification du rendez-vous');
  }
};

export const deleteAppointment = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await api.delete<{ success: boolean; message: string }>(`/appointments/${id}`);
    return res.data;
  } catch (error: any) {
    console.error('❌ Erreur deleteAppointment:', error);
    
    if (error.response?.status === 404) {
      throw new Error('Rendez-vous non trouvé');
    }
    
    throw new Error(error.message || 'Erreur lors de la suppression du rendez-vous');
  }
};