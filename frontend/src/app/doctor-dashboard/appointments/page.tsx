// app/doctor-dashboard/appointments/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { appointmentService } from '@/services/appointmentService';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, ArrowLeft, Search, Filter, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DoctorAppointmentsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadAppointments();
    }
  }, [user?.id]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      if (!user?.id) return;
      
      const data = await appointmentService.getDoctorAppointments(user.id);
      setAppointments(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patient?.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient?.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par statut
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // Filtre par date
    if (dateFilter) {
      filtered = filtered.filter(apt => apt.date === dateFilter);
    }

    // Trier par date et heure
    filtered.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });

    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (appointmentId: string, newStatus: AppointmentStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      await loadAppointments(); // Recharger la liste
    } catch (error) {
      console.error('Error updating status:', error);
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

  const getStatusActions = (appointment: Appointment) => {
    switch (appointment.status) {
      case AppointmentStatus.PENDING:
        return (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
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
          </div>
        );
      case AppointmentStatus.CONFIRMED:
        return (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              onClick={() => handleStatusUpdate(appointment.id, AppointmentStatus.COMPLETED)}
            >
              Marquer terminé
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleStatusUpdate(appointment.id, AppointmentStatus.CANCELLED)}
            >
              Annuler
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des rendez-vous...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => router.push('/doctor-dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestion des rendez-vous</h1>
              <p className="text-gray-600">Tous les rendez-vous de vos patients</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Search className="w-4 h-4 inline mr-1" />
                  Rechercher
                </label>
                <input
                  type="text"
                  placeholder="Nom patient, motif..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Filter className="w-4 h-4 inline mr-1" />
                  Statut
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as AppointmentStatus | 'ALL')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="ALL">Tous les statuts</option>
                  <option value={AppointmentStatus.PENDING}>En attente</option>
                  <option value={AppointmentStatus.CONFIRMED}>Confirmé</option>
                  <option value={AppointmentStatus.COMPLETED}>Terminé</option>
                  <option value={AppointmentStatus.CANCELLED}>Annulé</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date spécifique
                </label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex items-end">
                <Button onClick={loadAppointments} className="w-full" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des rendez-vous */}
        <Card>
          <CardHeader>
            <CardTitle>
              Rendez-vous ({filteredAppointments.length})
            </CardTitle>
            <CardDescription>
              Liste complète de tous vos rendez-vous
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Aucun rendez-vous trouvé</h3>
                <p className="mt-2 text-gray-500">
                  {searchTerm || statusFilter !== 'ALL' || dateFilter
                    ? 'Aucun rendez-vous ne correspond à vos critères de recherche.'
                    : 'Aucun rendez-vous programmé pour le moment.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-3">
                          <div className="flex-shrink-0">
                            <Calendar className="h-5 w-5 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <p className="text-lg font-semibold text-gray-900">
                                {formatDate(appointment.date)}
                              </p>
                              <Badge variant="outline" className="font-mono text-sm">
                                {appointment.time}
                              </Badge>
                              {getStatusBadge(appointment.status)}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <User className="h-4 w-4 text-gray-400" />
                                <span className="font-medium">
                                  {appointment.patient?.firstName} {appointment.patient?.lastName}
                                </span>
                              </div>
                              
                              <div>
                                <span className="font-medium">Motif:</span> {appointment.reason}
                              </div>
                              
                              {appointment.notes && (
                                <div className="md:col-span-2">
                                  <span className="font-medium">Notes:</span> {appointment.notes}
                                </div>
                              )}
                              
                              <div className="md:col-span-2 text-xs text-gray-500">
                                Créé le {new Date(appointment.createdAt).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2 lg:items-end">
                        {getStatusActions(appointment)}
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/prescriptions/new?patientId=${appointment.patientId}&appointmentId=${appointment.id}`}>
                              Créer ordonnance
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/doctor-dashboard/appointments/${appointment.id}`}>
                              Détails
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}