'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { appointmentService } from '@/services/appointmentService';
import { prescriptionService } from '@/services/prescriptionService';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { Prescription } from '@/types/prescription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, Plus, CalendarDays, FileText, Pill, Stethoscope, TrendingUp, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function PatientDashboard() {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      loadAppointments();
      loadPrescriptions();
    }
  }, [user]);

  const loadAppointments = async () => {
    try {
      const data = await appointmentService.getPatientAppointments(user!.id);
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  const loadPrescriptions = async () => {
    try {
      const data = await prescriptionService.getPatientPrescriptions(user!.id);
      setPrescriptions(data);
    } catch (error) {
      console.error('Error loading prescriptions:', error);
    } finally {
      setPrescriptionsLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;
    
    try {
      setCancellingId(appointmentId);
      
      // Mettre à jour l'état local immédiatement pour un feedback visuel rapide
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: AppointmentStatus.CANCELLED }
          : apt
      ));

      // Appel API pour annuler le rendez-vous
      const updatedAppointment = await appointmentService.cancelAppointment(appointmentId);
      console.log('✅ Rendez-vous annulé avec succès:', updatedAppointment);
      
      // Mettre à jour avec les données fraîches de l'API
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId 
          ? updatedAppointment
          : apt
      ));
      
      alert('Rendez-vous annulé avec succès !');
    } catch (error) {
      // En cas d'erreur, annuler le changement local et recharger
      await loadAppointments();
      
      console.error('Error cancelling appointment:', error);
      alert('Erreur lors de l\'annulation du rendez-vous');
    } finally {
      setCancellingId(null);
    }
  };

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      // Solution de secours si logout n'est pas disponible dans le contexte
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/home';
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const baseClasses = "border font-medium";
    
    switch (status) {
      case AppointmentStatus.PENDING:
        return (
          <Badge variant="secondary" className={`${baseClasses} bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200`}>
            En attente
          </Badge>
        );
      case AppointmentStatus.CONFIRMED:
        return (
          <Badge variant="default" className={`${baseClasses} bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200`}>
            Confirmé
          </Badge>
        );
      case AppointmentStatus.CANCELLED:
        return (
          <Badge variant="destructive" className={`${baseClasses} bg-red-100 text-red-800 hover:bg-red-100 border-red-200`}>
            Annulé
          </Badge>
        );
      case AppointmentStatus.COMPLETED:
        return (
          <Badge variant="outline" className={`${baseClasses} bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200`}>
            Terminé
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getMedicationsCount = (prescription: Prescription) => {
    return prescription.items?.length || 0;
  };

  const upcomingAppointments = appointments.filter(a => 
    a.status === AppointmentStatus.PENDING || 
    a.status === AppointmentStatus.CONFIRMED
  );

  if (appointmentsLoading && prescriptionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Chargement de vos données médicales...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex justify-between items-center w-full sm:w-auto">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-blue-800 bg-clip-text text-transparent">
                  Bonjour, {user?.firstName} {user?.lastName} !
                </h1>
                <p className="text-slate-600 font-medium">Votre espace santé personnel</p>
              </div>
              
              {/* Bouton logout - visible sur mobile */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="sm:hidden border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-3">
              <Button asChild className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25">
                <Link href="/patient-dashboard/new-appointment">
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau rendez-vous
                </Link>
              </Button>
              
              {/* Bouton logout - visible sur desktop */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
                className="hidden sm:flex border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-white to-blue-50/50 border-blue-100 shadow-lg shadow-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600">Total RDV</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <CalendarDays className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{appointments.length}</div>
              <p className="text-xs text-slate-500 mt-1">Dont {upcomingAppointments.length} à venir</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white to-emerald-50/50 border-emerald-100 shadow-lg shadow-emerald-500/5 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600">Ordonnances</CardTitle>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FileText className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{prescriptions.length}</div>
              <p className="text-xs text-slate-500 mt-1">Prescriptions actives</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white to-violet-50/50 border-violet-100 shadow-lg shadow-violet-500/5 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600">Médicaments</CardTitle>
              <div className="p-2 bg-violet-100 rounded-lg">
                <Pill className="h-4 w-4 text-violet-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">
                {prescriptions.reduce((total, pres) => total + getMedicationsCount(pres), 0)}
              </div>
              <p className="text-xs text-slate-500 mt-1">Traitements en cours</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-white to-amber-50/50 border-amber-100 shadow-lg shadow-amber-500/5 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600">Prochain RDV</CardTitle>
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800">{upcomingAppointments.length}</div>
              <p className="text-xs text-slate-500 mt-1">À planifier</p>
            </CardContent>
          </Card>
        </div>

        {/* Navigation par onglets */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 p-1 bg-slate-100/50 rounded-2xl">
            <TabsTrigger 
              value="appointments" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Mes Rendez-vous</span>
              <Badge variant="secondary" className="ml-1 bg-blue-100 text-blue-700">
                {appointments.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger 
              value="prescriptions" 
              className="flex items-center space-x-2 rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Mes Ordonnances</span>
              <Badge variant="secondary" className="ml-1 bg-emerald-100 text-emerald-700">
                {prescriptions.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            <Card className="border-slate-200/60 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-slate-800">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Mes rendez-vous médicaux</span>
                </CardTitle>
                <CardDescription>
                  Gérer et suivre vos consultations programmées
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Aucun rendez-vous programmé</h3>
                    <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                      Prenez votre premier rendez-vous pour commencer votre suivi médical.
                    </p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <Link href="/patient-dashboard/new-appointment">
                        Prendre un rendez-vous
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-white border border-slate-200/60 rounded-xl hover:shadow-lg hover:border-blue-200/60 transition-all duration-300"
                      >
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <p className="text-lg font-semibold text-slate-800">
                                  {formatDate(appointment.date)}
                                </p>
                                {getStatusBadge(appointment.status)}
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                <div className="flex items-center font-medium">
                                  <Clock className="h-4 w-4 mr-1.5 text-slate-400" />
                                  {appointment.time}
                                </div>
                                <div className="flex items-center font-medium">
                                  <User className="h-4 w-4 mr-1.5 text-slate-400" />
                                  Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                                </div>
                                {appointment.reason && (
                                  <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                    {appointment.reason}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4 sm:mt-0 sm:pl-4">
                          {(appointment.status === AppointmentStatus.PENDING || appointment.status === AppointmentStatus.CONFIRMED) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelAppointment(appointment.id)}
                              disabled={cancellingId === appointment.id}
                              className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                            >
                              {cancellingId === appointment.id ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-700 mr-2"></div>
                                  Annulation...
                                </>
                              ) : (
                                'Annuler'
                              )}
                            </Button>
                          )}
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/patient-dashboard/appointments/${appointment.id}`}>
                              Détails
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prescriptions" className="space-y-4">
            <Card className="border-slate-200/60 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 text-slate-800">
                  <FileText className="h-5 w-5 text-emerald-600" />
                  <span>Mes ordonnances médicales</span>
                </CardTitle>
                <CardDescription>
                  Consulter et gérer vos prescriptions en cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                {prescriptions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Aucune ordonnance</h3>
                    <p className="text-slate-600 max-w-sm mx-auto">
                      Vos prescriptions médicales apparaîtront ici après vos consultations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {prescriptions.map((prescription) => (
                      <div
                        key={prescription.id}
                        className="group flex flex-col sm:flex-row sm:items-start justify-between p-6 bg-white border border-slate-200/60 rounded-xl hover:shadow-lg hover:border-emerald-200/60 transition-all duration-300"
                      >
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                              <FileText className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <p className="text-lg font-semibold text-slate-800">
                                  Ordonnance du {formatShortDate(prescription.date)}
                                </p>
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                  {getMedicationsCount(prescription)} médicament(s)
                                </Badge>
                              </div>
                              
                              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-3">
                                <div className="flex items-center font-medium">
                                  <User className="h-4 w-4 mr-1.5 text-slate-400" />
                                  Dr. {prescription.doctorName}
                                  {prescription.doctorSpecialty && (
                                    <span className="ml-1 text-slate-500">- {prescription.doctorSpecialty}</span>
                                  )}
                                </div>
                              </div>

                              {prescription.notes && (
                                <div className="bg-slate-50 rounded-lg p-3 mb-3">
                                  <p className="text-sm text-slate-700">
                                    <span className="font-semibold">Notes du médecin :</span> {prescription.notes}
                                  </p>
                                </div>
                              )}

                              {/* Liste des médicaments */}
                              <div>
                                <div className="text-sm font-semibold text-slate-700 mb-2">
                                  Médicaments prescrits:
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {prescription.items?.slice(0, 3).map((item, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200/60"
                                    >
                                      <Pill className="w-3 h-3 mr-1.5" />
                                      {item.medicationName}
                                    </span>
                                  ))}
                                  {prescription.items?.length > 3 && (
                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                      +{prescription.items.length - 3} autres
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2 mt-4 sm:mt-0 sm:pl-4">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/patient-dashboard/prescriptions/${prescription.id}`}>
                              Voir détails
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}