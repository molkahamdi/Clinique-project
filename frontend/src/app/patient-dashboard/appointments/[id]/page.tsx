'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { appointmentService } from '@/services/appointmentService';
import { Appointment, AppointmentStatus, DoctorInfo } from '@/types/appointment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, MapPin, ArrowLeft, Mail, FileText, GraduationCap, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AppointmentDetailsPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const appointmentId = params.id as string;

  const loadAppointment = async () => {
    try {
      console.log('🔍 Chargement du rendez-vous:', appointmentId);
      const data = await appointmentService.getAppointment(appointmentId);
      console.log('✅ Rendez-vous chargé:', data);
      setAppointment(data);
      setError(null);
    } catch (error) {
      console.error('Error loading appointment:', error);
      setError('Erreur lors du chargement du rendez-vous');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (appointmentId) {
      loadAppointment();
    }
  }, [appointmentId]);

  const handleCancelAppointment = async () => {
    if (!appointment) return;
    
    // Vérifications côté client améliorée
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const now = new Date();
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    // Message d'erreur plus précis
    if (hoursDiff < 24) {
      const hoursRemaining = Math.floor(hoursDiff);
      const minutesRemaining = Math.floor((hoursDiff - hoursRemaining) * 60);
      
      let timeMessage = '';
      if (hoursRemaining > 0) {
        timeMessage = `Il reste ${hoursRemaining} heure(s) et ${minutesRemaining} minute(s) avant le rendez-vous.`;
      } else {
        timeMessage = `Il reste moins d'une heure avant le rendez-vous.`;
      }
      
      setError(`L'annulation doit être effectuée au moins 24 heures avant le rendez-vous. 
                ${timeMessage} 
                Veuillez contacter directement la clinique au 01 23 45 67 89.`);
      return;
    }

    if (!confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action est irréversible.')) return;
    
    try {
      setCancelling(true);
      setError(null);
      
      console.log('🔄 Début de l\'annulation du rendez-vous...');
      
      // Appel API pour annuler en base de données
      const updatedAppointment = await appointmentService.cancelAppointment(appointmentId);
      setAppointment(updatedAppointment);
      
      console.log('✅ Rendez-vous annulé avec succès');
      
      // Message de succès
      alert('Rendez-vous annulé avec succès !');
      
    } catch (error: any) {
      console.error('❌ Erreur lors de l\'annulation:', error);
      
      // Afficher le message d'erreur spécifique du backend
      setError(error.message || 'Erreur lors de l\'annulation du rendez-vous. Veuillez réessayer.');
      
      // Recharger les données actuelles
      await loadAppointment();
    } finally {
      setCancelling(false);
    }
  };

  const handleRescheduleAppointment = () => {
    if (!appointment) return;
    
    router.push(`/patient-dashboard/new-appointment?reschedule=${appointmentId}`);
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const statusConfig = {
      [AppointmentStatus.PENDING]: { 
        label: 'En attente', 
        variant: 'secondary' as const,
        description: 'En attente de confirmation',
        className: 'bg-amber-100 text-amber-800 border-amber-200'
      },
      [AppointmentStatus.CONFIRMED]: { 
        label: 'Confirmé', 
        variant: 'default' as const,
        description: 'Rendez-vous confirmé',
        className: 'bg-emerald-100 text-emerald-800 border-emerald-200'
      },
      [AppointmentStatus.CANCELLED]: { 
        label: 'Annulé', 
        variant: 'destructive' as const,
        description: 'Rendez-vous annulé définitivement',
        className: 'bg-red-100 text-red-800 border-red-200'
      },
      [AppointmentStatus.COMPLETED]: { 
        label: 'Terminé', 
        variant: 'outline' as const,
        description: 'Consultation terminée',
        className: 'bg-blue-100 text-blue-800 border-blue-200'
      },
    };
    
    const config = statusConfig[status];
    return (
      <div className="flex items-center space-x-2">
        <Badge variant={config.variant} className={config.className}>
          {config.label}
        </Badge>
        <span className="text-sm text-gray-500">{config.description}</span>
      </div>
    );
  };

  const getDoctorSpeciality = (doctor?: DoctorInfo): string => {
    if (!doctor) return 'Médecin généraliste';
    return doctor.speciality || doctor.specialization || 'Médecin généraliste';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const canCancel = appointment?.status === AppointmentStatus.PENDING || 
                   appointment?.status === AppointmentStatus.CONFIRMED;

  const canReschedule = appointment?.status === AppointmentStatus.PENDING || 
                       appointment?.status === AppointmentStatus.CONFIRMED;

  const getCancellationInfo = () => {
    if (!appointment) return { canCancelNow: false, message: '', hoursRemaining: 0 };
    
    const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
    const now = new Date();
    const timeDiff = appointmentDateTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      const hoursRemaining = Math.floor(hoursDiff);
      const minutesRemaining = Math.floor((hoursDiff - hoursRemaining) * 60);
      
      let timeMessage = '';
      if (hoursRemaining > 0) {
        timeMessage = `Il reste ${hoursRemaining} heure(s) et ${minutesRemaining} minute(s) avant le rendez-vous.`;
      } else {
        timeMessage = `Il reste moins d'une heure avant le rendez-vous.`;
      }
      
      return { 
        canCancelNow: false, 
        message: `L'annulation en ligne n'est plus possible. ${timeMessage} Contactez la clinique au 01 23 45 67 89.`,
        hoursRemaining: hoursDiff
      };
    }
    
    return { 
      canCancelNow: true, 
      message: `Vous pouvez annuler jusqu'à ${Math.floor(hoursDiff - 24)} heure(s) avant le rendez-vous.`,
      hoursRemaining: hoursDiff
    };
  };

  const cancellationInfo = getCancellationInfo();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des détails...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Rendez-vous non trouvé</p>
          <Button onClick={() => router.push('/patient-dashboard')} className="mt-4">
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => router.push('/patient-dashboard')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Détails du rendez-vous</h1>
                <p className="text-gray-600">Informations complètes sur votre rendez-vous</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-line">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center justify-between">
                  <span>Votre Rendez-vous Médical</span>
                  {getStatusBadge(appointment.status)}
                </CardTitle>
                <CardDescription>
                  Consultation avec le Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Date</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatDate(appointment.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Heure</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatTime(appointment.time)}
                      </p>
                    </div>
                  </div>
                </div>

                {appointment.reason && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900">Motif de la consultation</h3>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-gray-700">{appointment.reason}</p>
                    </div>
                  </div>
                )}

                {appointment.notes && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-900">Notes supplémentaires</h3>
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-gray-700">{appointment.notes}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-gray-900">Informations de suivi</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Créé le:</span>
                      <p>{new Date(appointment.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <span className="font-medium">Dernière mise à jour:</span>
                      <p>{new Date(appointment.updatedAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {(canCancel || canReschedule) && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions disponibles</CardTitle>
                  <CardDescription>
                    Gérer votre rendez-vous
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {canCancel && cancellationInfo.canCancelNow && (
                      <Button 
                        variant="outline" 
                        onClick={handleCancelAppointment}
                        disabled={cancelling}
                        className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                      >
                        {cancelling ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700 mr-2"></div>
                            Annulation...
                          </>
                        ) : (
                          'Annuler le rendez-vous'
                        )}
                      </Button>
                    )}
                    {canReschedule && (
                      <Button 
                        onClick={handleRescheduleAppointment}
                        className="flex-1"
                        disabled={!cancellationInfo.canCancelNow}
                      >
                        Reporter le rendez-vous
                      </Button>
                    )}
                  </div>
                  
                  {canCancel && !cancellationInfo.canCancelNow && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="whitespace-pre-line">
                        {cancellationInfo.message}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {canCancel && cancellationInfo.canCancelNow && (
                    <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <p className="text-sm text-orange-800">
                        ⚠️ L'annulation doit être effectuée au moins 24 heures à l'avance. 
                        En cas d'urgence, contactez directement le cabinet.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {appointment.status === AppointmentStatus.CANCELLED && (
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-red-900">Rendez-vous annulé</CardTitle>
                  <CardDescription className="text-red-700">
                    Ce rendez-vous a été annulé le {new Date(appointment.updatedAt).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-red-800">
                      Pour prendre un nouveau rendez-vous, veuillez consulter la page de réservation.
                    </p>
                    <Button asChild>
                      <Link href="/patient-dashboard/new-appointment">
                        Prendre un nouveau rendez-vous
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {appointment.status === AppointmentStatus.COMPLETED && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-900">Consultation terminée</CardTitle>
                  <CardDescription className="text-green-700">
                    Cette consultation a été réalisée avec succès
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-green-800">
                      Votre consultation avec le Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName} 
                      a été réalisée le {formatDate(appointment.date)}.
                    </p>
                    <div className="flex space-x-3">
                      <Button asChild variant="outline">
                        <Link href={`/patient-dashboard/prescriptions`}>
                          <FileText className="w-4 h-4 mr-2" />
                          Consulter mes ordonnances
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link href="/patient-dashboard/new-appointment">
                          Prendre un nouveau rendez-vous
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-600" />
                  Votre Médecin
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center space-x-1">
                      <GraduationCap className="h-3 w-3" />
                      <span>{getDoctorSpeciality(appointment.doctor)}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  {appointment.doctor?.email && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-gray-600 break-all">{appointment.doctor.email}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Lieu de consultation</p>
                      <p className="text-gray-600">Clinique Médicale Principal</p>
                      <p className="text-xs text-gray-500">123 Avenue de la Santé, 75000 Paris</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vos informations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom complet</p>
                    <p className="font-semibold text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                  </div>
                  <User className="w-5 h-5 text-gray-400" />
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">{user?.email}</p>
                  </div>
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}