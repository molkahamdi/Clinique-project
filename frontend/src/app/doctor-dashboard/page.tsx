// app/doctor-dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { appointmentService } from '@/services/appointmentService';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, CalendarDays, FileText, Users, Stethoscope, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';

function DoctorDashboardContent() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    today: 0,
    week: 0,
    pending: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🚀 Démarrage du chargement du dashboard docteur...');
      
      if (!user?.id) {
        console.log('❌ Aucun utilisateur connecté');
        return;
      }

      // Charger les rendez-vous du docteur connecté
      const doctorAppointments = await appointmentService.getDoctorAppointments(user.id);
      console.log('📊 Rendez-vous du docteur chargés:', doctorAppointments.length);
      
      setAppointments(doctorAppointments);
      
      // Vérifier si on utilise des données de démonstration
      if (doctorAppointments.length > 0 && doctorAppointments[0].id?.includes('appt-')) {
        setUsingDemoData(true);
        console.log('ℹ️ Utilisation des données de démonstration');
      }

      // Filtrer et organiser les données
      filterAndOrganizeAppointments(doctorAppointments);
      calculateStats(doctorAppointments);

    } catch (error) {
      console.error('💥 Erreur critique:', error);
      // En cas d'erreur, utiliser des données de secours
      const fallbackData = appointmentService.getDemoDoctorAppointments(user?.id || 'doctor-1');
      setAppointments(fallbackData);
      filterAndOrganizeAppointments(fallbackData);
      calculateStats(fallbackData);
      setUsingDemoData(true);
    } finally {
      setLoading(false);
      console.log('🏁 Chargement du dashboard terminé');
    }
  };

  const filterAndOrganizeAppointments = (appointmentsList: Appointment[]) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Rendez-vous du jour
    const todayApps = appointmentsList.filter(apt => apt.date === today);
    setTodayAppointments(todayApps);

    // Rendez-vous à venir (7 prochains jours)
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const upcoming = appointmentsList.filter(apt => 
      apt.date > today && apt.date <= nextWeek &&
      (apt.status === AppointmentStatus.PENDING || apt.status === AppointmentStatus.CONFIRMED)
    );
    setUpcomingAppointments(upcoming);
  };

  const calculateStats = (appointmentsList: Appointment[]) => {
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const todayCount = appointmentsList.filter(apt => apt.date === today).length;
    const weekCount = appointmentsList.filter(apt => 
      apt.date >= today && apt.date <= nextWeek
    ).length;
    const pendingCount = appointmentsList.filter(apt => 
      apt.status === AppointmentStatus.PENDING
    ).length;

    setStats({
      today: todayCount,
      week: weekCount,
      pending: pendingCount,
      total: appointmentsList.length
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      // Recharger les données
      await loadDashboardData();
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const statusConfig = {
      [AppointmentStatus.PENDING]: { label: 'En attente', variant: 'secondary' as const },
      [AppointmentStatus.CONFIRMED]: { label: 'Confirmé', variant: 'default' as const },
      [AppointmentStatus.CANCELLED]: { label: 'Annulé', variant: 'destructive' as const },
      [AppointmentStatus.COMPLETED]: { label: 'Terminé', variant: 'outline' as const },
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUniquePatientsCount = () => {
    const patientIds = new Set(appointments.map(apt => apt.patientId));
    return patientIds.size;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Bonjour, Dr. {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600">Tableau de bord médical</p>
              {usingDemoData && (
                <Badge variant="outline" className="mt-2 bg-yellow-100 text-yellow-800">
                  Mode Démonstration
                </Badge>
              )}
            </div>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button asChild variant="outline">
                <Link href="/prescriptions/new">
                  <FileText className="w-4 h-4 mr-2" />
                  Nouvelle ordonnance
                </Link>
              </Button>
              <Button asChild>
                <Link href="/doctor-dashboard/appointments">
                  <Calendar className="w-4 h-4 mr-2" />
                  Voir tous les RDV
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bannière démo */}
        {usingDemoData && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center">
              <Stethoscope className="h-5 w-5 text-blue-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-blue-800">
                  Système de Démonstration
                </h3>
                <p className="text-sm text-blue-700">
                  Données simulées utilisées pour la démonstration. Toutes les fonctionnalités sont opérationnelles.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">RDV Aujourd'hui</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.today}</div>
              <p className="text-xs text-muted-foreground">
                {stats.today === 0 ? 'Aucun rendez-vous' : `${stats.today} rendez-vous programmés`}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cette semaine</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.week}</div>
              <p className="text-xs text-muted-foreground">
                Rendez-vous sur 7 jours
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getUniquePatientsCount()}</div>
              <p className="text-xs text-muted-foreground">
                Patients uniques suivis
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground">
                RDV à confirmer
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rendez-vous du jour */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="w-5 h-5 mr-2 text-blue-600" />
                Rendez-vous aujourd'hui
                <Badge variant="secondary" className="ml-2">
                  {todayAppointments.length}
                </Badge>
              </CardTitle>
              <CardDescription>
                {formatDate(new Date().toISOString())}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-4 text-gray-500">Aucun rendez-vous aujourd'hui</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg bg-white shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="font-mono">
                            {appointment.time}
                          </Badge>
                          {getStatusBadge(appointment.status)}
                        </div>
                        <div className="flex space-x-2">
                          {appointment.status === AppointmentStatus.PENDING && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStatusUpdate(appointment.id, AppointmentStatus.CONFIRMED)}
                              >
                                Confirmer
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleStatusUpdate(appointment.id, AppointmentStatus.CANCELLED)}
                              >
                                Annuler
                              </Button>
                            </>
                          )}
                          <Button size="sm" asChild>
                            <Link href={`/prescriptions/new?patientId=${appointment.patientId}&appointmentId=${appointment.id}`}>
                              Prescrire
                            </Link>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="font-medium text-lg">
                          <User className="w-4 h-4 inline mr-2 text-gray-400" />
                          {appointment.patient?.firstName} {appointment.patient?.lastName}
                        </p>
                        <p className="text-gray-600">{appointment.reason}</p>
                        {appointment.notes && (
                          <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                            📝 {appointment.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions rapides et prochains RDV */}
          <div className="space-y-8">
            {/* Actions rapides */}
            <Card>
              <CardHeader>
                <CardTitle>Actions médicales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button asChild className="w-full justify-start h-14">
                    <Link href="/prescriptions/new">
                      <FileText className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Nouvelle ordonnance</div>
                        <div className="text-sm font-normal">Créer une prescription</div>
                      </div>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full justify-start h-14">
                    <Link href="/doctor-dashboard/appointments">
                      <Calendar className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Gestion des RDV</div>
                        <div className="text-sm font-normal">Voir tous les rendez-vous</div>
                      </div>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full justify-start h-14">
                    <Link href="/prescriptions">
                      <FileText className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Ordonnances</div>
                        <div className="text-sm font-normal">Voir l'historique</div>
                      </div>
                    </Link>
                  </Button>

                  <Button asChild variant="outline" className="w-full justify-start h-14">
                    <Link href="/doctor-dashboard/patients">
                      <Users className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-semibold">Patients</div>
                        <div className="text-sm font-normal">Liste des patients</div>
                      </div>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Rendez-vous à venir */}
            {upcomingAppointments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    Prochains rendez-vous
                    <Badge variant="secondary" className="ml-2">
                      {upcomingAppointments.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {upcomingAppointments.slice(0, 5).map((appointment) => (
                      <div key={appointment.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-sm">
                              {formatDate(appointment.date)} à {appointment.time}
                            </p>
                            <p className="text-sm text-gray-600">
                              {appointment.patient?.firstName} {appointment.patient?.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{appointment.reason}</p>
                          </div>
                        </div>
                        {getStatusBadge(appointment.status)}
                      </div>
                    ))}
                    {upcomingAppointments.length > 5 && (
                      <Button asChild variant="outline" className="w-full mt-2">
                        <Link href="/doctor-dashboard/appointments">
                          Voir tous les {upcomingAppointments.length} rendez-vous
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Page principale avec protection de rôle
export default function DoctorDashboardPage() {
  return (
    <RoleGuard allowedRoles={[UserRole.DOCTOR]}>
      <DoctorDashboardContent />
    </RoleGuard>
  );
}