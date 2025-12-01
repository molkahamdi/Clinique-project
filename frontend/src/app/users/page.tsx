'use client';

import { useState, useEffect } from 'react';
import { UserRole } from '@/lib/types';
import { useUsers, useDeleteUser } from '@/hooks/use-users';
import { UsersTable } from '@/components/users/users-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Shield,
  Stethoscope,
  UserCog,
  ArrowLeft,
  Download,
  Upload,
  Settings,
  Mail,
  Phone,
  Calendar,
  FileText
} from 'lucide-react';
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole as AuthUserRole } from '@/types/auth';

type RoleFilter = UserRole | 'ALL';

interface UserStats {
  total: number;
  admins: number;
  doctors: number;
  receptionists: number;
  patients: number;
  activeUsers: number;
  recentUsers: number;
}

export default function UsersPage() {
  const [selectedRole, setSelectedRole] = useState<RoleFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [userStats, setUserStats] = useState<UserStats>({
    total: 0,
    admins: 0,
    doctors: 0,
    receptionists: 0,
    patients: 0,
    activeUsers: 0,
    recentUsers: 0
  });
  
  const { data: users = [], isLoading, error } = useUsers(selectedRole === 'ALL' ? undefined : selectedRole);
  const deleteUserMutation = useDeleteUser();

  // Calcul des statistiques dynamiques
  useEffect(() => {
    if (users.length > 0) {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      
      const stats = {
        total: users.length,
        admins: users.filter(user => user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN).length,
        doctors: users.filter(user => user.role === UserRole.DOCTOR).length,
        receptionists: users.filter(user => user.role === UserRole.RECEP).length,
        patients: users.filter(user => user.role === UserRole.PATIENT).length,
        activeUsers: users.filter(user => user.isActive !== false).length,
        recentUsers: users.filter(user => {
          const createdDate = new Date(user.createdAt);
          return createdDate > thirtyDaysAgo;
        }).length
      };
      
      setUserStats(stats);
    }
  }, [users]);

  const handleDeleteUser = async (id: string, role: UserRole) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteUserMutation.mutateAsync({ id, role });
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const roleOptions = [
    { value: 'ALL', label: 'Tous les rôles' },
    { value: UserRole.ADMIN, label: 'Administrateurs' },
    { value: UserRole.RECEP, label: 'Réceptionnistes' },
    { value: UserRole.DOCTOR, label: 'Médecins' },
    { value: UserRole.PATIENT, label: 'Patients' },
  ];

  const statCards = [
    {
      title: 'Total Utilisateurs',
      value: userStats.total,
      icon: Users,
      color: 'bg-blue-500',
      description: 'Utilisateurs enregistrés',
      change: '+12% ce mois'
    },
    {
      title: 'Médecins',
      value: userStats.doctors,
      icon: Stethoscope,
      color: 'bg-green-500',
      description: 'Personnel médical',
      change: '+5% ce mois'
    },
    {
      title: 'Patients',
      value: userStats.patients,
      icon: UserCog,
      color: 'bg-purple-500',
      description: 'Patients actifs',
      change: '+18% ce mois'
    },
    {
      title: 'Nouveaux Utilisateurs',
      value: userStats.recentUsers,
      icon: Calendar,
      color: 'bg-orange-500',
      description: '30 derniers jours',
      change: '+8% ce mois'
    }
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-6">
        <Card className="w-full max-w-md border-red-200 bg-white shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 text-sm mb-4">Impossible de charger la liste des utilisateurs</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={[AuthUserRole.ADMIN, AuthUserRole.SUPER_ADMIN]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
        {/* Header avec navigation */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/dashboard-admin">
                  <Button variant="ghost" size="icon" className="rounded-lg hover:bg-gray-100 transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </Button>
                </Link>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                    <p className="text-sm text-gray-600">
                      Administration complète du système utilisateurs
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">

                <div className="flex items-center space-x-3 bg">
              <Button
                asChild
                variant="outline"
                className="
                border-red-500 
                text-red-600 
                hover:text-red-600 
                hover:bg-red-50 
                hover:border-red-600
              "
              >
                <Link href="/auth/login">
                  <FileText className="w-4 h-4 mr-2" />
                  Déconnexion
                </Link>
              </Button>
               
                <Link href="/users/create">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Nouvel Utilisateur
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          </div>
        </header>

        <div className="container mx-auto p-6 space-y-6">
          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <Card key={index} className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                          {stat.title}
                        </p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">
                          {stat.value}
                        </p>
                        <p className="text-xs text-green-600 font-medium mt-1">
                          {stat.change}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                        <IconComponent className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Carte principale de gestion */}
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    Liste des Utilisateurs
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Gestion complète des comptes utilisateurs et des permissions
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                    {users.length} utilisateurs
                  </Badge>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{userStats.activeUsers} actifs</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Barre de recherche et filtres */}
              <div className="flex flex-col lg:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher un utilisateur par nom, email ou téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 transition-colors h-11"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Select
                    value={selectedRole}
                    onValueChange={(value: RoleFilter) => setSelectedRole(value)}
                  >
                    <SelectTrigger className="w-[220px] h-11 border-gray-300 focus:border-blue-500">
                      <Filter className="h-4 w-4 mr-2 text-gray-500" />
                      <SelectValue placeholder="Filtrer par rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center space-x-2">
                            {option.value !== 'ALL' && (
                              <div className={`w-2 h-2 rounded-full ${
                                option.value === UserRole.ADMIN ? 'bg-purple-500' :
                                option.value === UserRole.DOCTOR ? 'bg-green-500' :
                                option.value === UserRole.RECEP ? 'bg-blue-500' : 'bg-orange-500'
                              }`} />
                            )}
                            <span>{option.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                 
                </div>
              </div>

              {/* Contenu principal */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                  <p className="text-gray-600">Chargement des utilisateurs...</p>
                </div>
              ) : (
                <UsersTable
                  users={users}
                  onDelete={handleDeleteUser}
                  isDeleting={deleteUserMutation.isPending}
                  searchTerm={searchTerm}
                />
              )}
            </CardContent>
          </Card>

          

            

            
            
          </div>
        </div>
      
    </RoleGuard>
  );
}