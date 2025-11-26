'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { appointmentService } from '@/services/appointmentService';
import { DoctorInfo } from '@/types/appointment';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Calendar, Clock, User, Stethoscope, AlertCircle, GraduationCap } from 'lucide-react';

export default function NewAppointmentPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<DoctorInfo[]>([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    doctorId: '',
    reason: ''
  });

  // Horaires disponibles
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        console.log('🔄 Chargement des médecins...');
        const doctorsData = await appointmentService.getDoctors();
        console.log('✅ Médecins chargés:', doctorsData);
        setDoctors(doctorsData);
      } catch (error) {
        console.error('❌ Erreur chargement médecins:', error);
      } finally {
        setDoctorsLoading(false);
      }
    };

    loadDoctors();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!user?.id || !formData.date || !formData.time || !formData.doctorId) {
      alert('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Validation de la date
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert('Veuillez choisir une date future');
      return;
    }

    // Validation du doctorId
    if (!appointmentService.isValidUUID(formData.doctorId)) {
      alert('ID du médecin invalide');
      return;
    }

    setLoading(true);

    try {
      const appointmentData = {
        date: formData.date,
        time: formData.time,
        reason: formData.reason,
        doctorId: formData.doctorId,
        patientId: user.id,
      };

      console.log('📋 Création rendez-vous avec données:', appointmentData);
      
      const result = await appointmentService.createAppointment(appointmentData);
      console.log('✅ Rendez-vous créé:', result);
      
      alert('Rendez-vous créé avec succès !');
      router.push('/patient-dashboard');
    } catch (error: any) {
      console.error('❌ Erreur création rendez-vous:', error);
      alert(`Erreur lors de la création du rendez-vous: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fonction utilitaire pour obtenir la spécialité d'un médecin
  const getDoctorSpeciality = (doctor: DoctorInfo): string => {
    return doctor.speciality || doctor.specialization || 'Médecin généraliste';
  };

  // Date minimale (aujourd'hui)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/patient-dashboard')}
              className="border-slate-300 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                Nouveau rendez-vous
              </h1>
              <p className="text-slate-600 font-medium">Prendre un nouveau rendez-vous médical</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-slate-200/60 shadow-xl">
          <CardHeader className="pb-6 border-b border-slate-200/60">
            <CardTitle className="flex items-center space-x-3 text-slate-800 text-2xl">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <span>Formulaire de rendez-vous</span>
            </CardTitle>
            <CardDescription className="text-slate-600 text-base mt-2">
              Remplissez les informations pour prendre un nouveau rendez-vous avec notre équipe médicale
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Colonne gauche - Informations rendez-vous */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                    <Stethoscope className="h-5 w-5 text-blue-600" />
                    <span>Informations du rendez-vous</span>
                  </h3>

                  {/* Sélection du médecin */}
                  <div className="space-y-3">
                    <Label htmlFor="doctorId" className="text-sm font-semibold text-slate-700">
                      Médecin <span className="text-red-500">*</span>
                    </Label>
                    {doctorsLoading ? (
                      <div className="flex items-center space-x-3 p-4 bg-slate-100 rounded-lg">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <span className="text-slate-600 font-medium">Chargement des médecins...</span>
                      </div>
                    ) : (
                      <Select value={formData.doctorId} onValueChange={(value) => handleInputChange('doctorId', value)}>
                        <SelectTrigger className="w-full bg-white border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12">
                          <SelectValue placeholder="Choisir un médecin" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={doctor.id}>
                              <div className="flex flex-col space-y-1">
                                <span className="font-medium">Dr. {doctor.firstName} {doctor.lastName}</span>
                                <div className="flex items-center space-x-1 text-sm text-slate-500">
                                  <GraduationCap className="h-3 w-3" />
                                  <span>{getDoctorSpeciality(doctor)}</span>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {doctors.length === 0 && !doctorsLoading && (
                      <div className="flex items-center space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <p className="text-sm text-amber-700">
                          Aucun médecin disponible. Veuillez contacter l'administration.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Sélection de la date */}
                  <div className="space-y-3">
                    <Label htmlFor="date" className="text-sm font-semibold text-slate-700">
                      Date du rendez-vous <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        type="date"
                        id="date"
                        value={formData.date}
                        onChange={(e) => handleInputChange('date', e.target.value)}
                        min={today}
                        required
                        className="pl-10 h-12 bg-white border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Sélection de l'heure */}
                  <div className="space-y-3">
                    <Label htmlFor="time" className="text-sm font-semibold text-slate-700">
                      Heure <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.time} onValueChange={(value) => handleInputChange('time', value)}>
                      <SelectTrigger className="w-full bg-white border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12">
                        <SelectValue placeholder="Choisir une heure" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <span>{time}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Motif de la consultation */}
                  <div className="space-y-3">
                    <Label htmlFor="reason" className="text-sm font-semibold text-slate-700">
                      Motif de la consultation
                    </Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      placeholder="Décrivez brièvement la raison de votre visite, vos symptômes, ou toute information utile pour le médecin..."
                      rows={4}
                      className="bg-white border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>

                {/* Colonne droite - Informations patient */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-slate-800 flex items-center space-x-2">
                    <User className="h-5 w-5 text-blue-600" />
                    <span>Vos informations</span>
                  </h3>

                  <Card className="bg-gradient-to-br from-slate-50 to-blue-50/30 border-slate-200/60">
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-600">Nom complet</p>
                        <p className="text-lg font-semibold text-slate-800">
                          {user?.firstName} {user?.lastName}
                        </p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-600">Email</p>
                        <p className="text-base text-slate-700">{user?.email}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-slate-600">Téléphone</p>
                        <p className="text-base text-slate-700">
                          {user?.phone || (
                            <span className="text-slate-400 italic">Non renseigné</span>
                          )}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-200/60">
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <AlertCircle className="h-4 w-4 text-blue-500" />
                          <span>Ces informations seront transmises au médecin</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Aide */}
                  <Card className="bg-amber-50/50 border-amber-200/60">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-amber-800">Conseil médical</p>
                          <p className="text-xs text-amber-700">
                            Pour les urgences médicales, appelez directement le clinique. 
                            Ce formulaire est destiné aux rendez-vous de consultation non urgents.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex space-x-4 pt-6 border-t border-slate-200/60">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/patient-dashboard')}
                  className="flex-1 border-slate-300 hover:bg-slate-100 h-12 font-semibold"
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || doctorsLoading || doctors.length === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 h-12 font-semibold text-white"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Création en cours...</span>
                    </div>
                  ) : (
                    'Confirmer le rendez-vous'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}