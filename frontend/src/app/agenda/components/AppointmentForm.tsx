"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Appointment, AppointmentType } from "@/types/appointment";

interface AppointmentFormProps {
  onSubmit: (appt: Omit<Appointment, 'id'> | Appointment) => void;
  initialData?: Appointment | null;
  onCancel?: () => void;
}

export default function AppointmentForm({ onSubmit, initialData, onCancel }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    patient: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    date: "",
    time: "",
    type: "Consultation" as AppointmentType,
  });

  useEffect(() => {
    if (initialData) {
      const dateObj = new Date(initialData.date);
      setFormData({
        patient: initialData.patient,
        dob: initialData.dob,
        phone: initialData.phone,
        email: initialData.email,
        address: initialData.address,
        date: dateObj.toISOString().split('T')[0],
        time: dateObj.toTimeString().slice(0, 5),
        type: initialData.type,
      });
    } else {
      setFormData({
        patient: "",
        dob: "",
        phone: "",
        email: "",
        address: "",
        date: "",
        time: "",
        type: "Consultation",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time) {
      alert("Veuillez sélectionner une date et une heure");
      return;
    }

    const dateTime = new Date(`${formData.date}T${formData.time}`);
    
    const appointmentData = {
      ...(initialData && { id: initialData.id }),
      patient: formData.patient,
      dob: formData.dob,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      date: dateTime.toISOString(),
      type: formData.type,
    };

    onSubmit(appointmentData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nom du patient *</label>
        <Input 
          placeholder="Nom complet" 
          value={formData.patient} 
          onChange={(e) => handleChange('patient', e.target.value)} 
          required 
          className="rounded-xl border-gray-300 focus:ring-cyan-300 mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date de naissance</label>
        <Input 
          type="date" 
          value={formData.dob} 
          onChange={(e) => handleChange('dob', e.target.value)} 
          className="rounded-xl border-gray-300 focus:ring-cyan-300 mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Téléphone *</label>
        <Input 
          type="tel" 
          placeholder="Téléphone" 
          value={formData.phone} 
          onChange={(e) => handleChange('phone', e.target.value)} 
          required 
          className="rounded-xl border-gray-300 focus:ring-cyan-300 mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email *</label>
        <Input 
          type="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={(e) => handleChange('email', e.target.value)} 
          required 
          className="rounded-xl border-gray-300 focus:ring-cyan-300 mt-1"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Adresse *</label>
        <Input 
          placeholder="Adresse complète" 
          value={formData.address} 
          onChange={(e) => handleChange('address', e.target.value)} 
          required 
          className="rounded-xl border-gray-300 focus:ring-cyan-300 mt-1"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Date *</label>
          <Input 
            type="date" 
            value={formData.date} 
            onChange={(e) => handleChange('date', e.target.value)} 
            required 
            className="rounded-xl border-gray-300 focus:ring-cyan-300 mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Heure *</label>
          <Input 
            type="time" 
            value={formData.time} 
            onChange={(e) => handleChange('time', e.target.value)} 
            required 
            className="rounded-xl border-gray-300 focus:ring-cyan-300 mt-1"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type de rendez-vous</label>
        <select
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 focus:ring-cyan-300 focus:outline-none mt-1"
        >
          <option value="Consultation">Consultation</option>
          <option value="Suivi">Suivi</option>
          <option value="Urgence">Urgence</option>
          <option value="Bilan">Bilan</option>
        </select>
      </div>

      <div className="flex gap-3 pt-2">
        <Button 
          type="submit" 
          className="flex-1 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white hover:bg-white hover:text-[#0f172a] font-bold rounded-xl shadow-lg transition"
        >
          {initialData ? "Modifier" : "Enregistrer"}
        </Button>
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="flex-1 rounded-xl"
          >
            Annuler
          </Button>
        )}
      </div>
    </form>
  );
}