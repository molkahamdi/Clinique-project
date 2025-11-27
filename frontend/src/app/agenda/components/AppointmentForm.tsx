// app/agenda/components/AppointmentForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAllPatients, getAllDoctors } from "@/lib/users";
import { useAuth } from "@/context/AuthContext";
import { CreateAppointmentDto } from "@/types/appointment";

export default function AppointmentForm({
  onSubmit,
  onCancel,
  initialData,
}: {
  onSubmit: (data: CreateAppointmentDto | any) => void;
  onCancel: () => void;
  initialData?: any;
}) {
  const { user } = useAuth();

  const [patients, setPatients] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
  });

  // LOAD PATIENTS + DOCTORS LIST
  useEffect(() => {
    (async () => {
      const p = await getAllPatients();
      const d = await getAllDoctors();
      setPatients(p);
      setDoctors(d);
    })();
  }, []);

  // AUTO-FILL IF EDITING
  useEffect(() => {
    if (initialData) {
      setPatientId(initialData.patientId);
      setDoctorId(initialData.doctorId);

      setFormData({
        date: initialData.date?.split("T")[0],
        time: initialData.time,
        reason: initialData.reason || "",
      });
    }
  }, [initialData]);

  const handleSubmit = (e: any) => {
    e.preventDefault();

    const dto: CreateAppointmentDto = {
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      patientId,
      doctorId,
    };

    onSubmit(dto);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* PATIENT DROPDOWN */}
      <label className="font-medium">Patient *</label>
      <select
        className="w-full border p-2 rounded"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        required
      >
        <option value="">-- Choisir un patient --</option>
        {patients.map((p) => (
          <option key={p.id} value={p.id}>
            {p.firstName} {p.lastName}
          </option>
        ))}
      </select>

      {/* DOCTOR DROPDOWN */}
      <label className="font-medium">Médecin *</label>
      <select
        className="w-full border p-2 rounded"
        value={doctorId}
        onChange={(e) => setDoctorId(e.target.value)}
        required
      >
        <option value="">-- Choisir un docteur --</option>
        {doctors.map((d) => (
          <option key={d.id} value={d.id}>
            Dr. {d.firstName} {d.lastName}
          </option>
        ))}
      </select>

      {/* DATE */}
      <label className="font-medium">Date *</label>
      <Input
        type="date"
        value={formData.date}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, date: e.target.value }))
        }
        required
      />

      {/* TIME */}
      <label className="font-medium">Heure *</label>
      <Input
        type="time"
        value={formData.time}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, time: e.target.value }))
        }
        required
      />

      

      <div className="flex gap-3">
        <Button type="submit" className="flex-1">
          {initialData ? "Modifier" : "Enregistrer"}
        </Button>

        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
      </div>
    </form>
  );
}
