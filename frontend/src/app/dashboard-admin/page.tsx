// app/dashboard-admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { 
  Building, 
  Users, 
  Stethoscope, 
  Calendar,
  Bell,
  Search,
  MoreVertical,
  Plus,
  TrendingUp,
  Activity,
  Shield,
  Settings,
  LogOut,
  User,
  Clock
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { useRouter } from 'next/navigation';

// 🔐 IMPORTATION DU ROLEGUARD
import RoleGuard from '@/components/guards/RoleGuard';
import { UserRole } from '@/types/auth';

// Données simulées pour les graphiques
const consultationData = [
  { name: 'Lun', consultations: 12 },
  { name: 'Mar', consultations: 19 },
  { name: 'Mer', consultations: 15 },
  { name: 'Jeu', consultations: 22 },
  { name: 'Ven', consultations: 18 },
  { name: 'Sam', consultations: 8 },
];

const revenueData = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Fév', revenue: 52000 },
  { name: 'Mar', revenue: 48000 },
  { name: 'Avr', revenue: 61000 },
  { name: 'Mai', revenue: 55000 },
  { name: 'Jun', revenue: 68000 },
];

const serviceData = [
  { name: 'Consultation', value: 45 },
  { name: 'Urgence', value: 25 },
  { name: 'Chirurgie', value: 15 },
  { name: 'Radiologie', value: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardAdminPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState(3);
  const router = useRouter();
  
  const stats = [
    {
      title: "Consultations Aujourd'hui",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: Stethoscope,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Staff Actif",
      value: "18",
      change: "+2",
      trend: "up",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Rendez-vous en Attente",
      value: "8",
      change: "-3",
      trend: "down",
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Taux d'Occupation",
      value: "78%",
      change: "+5%",
      trend: "up",
      icon: Activity,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const recentActivities = [
    { id: 1, action: "Nouveau médecin ajouté", time: "Il y a 5 min", type: "staff" },
    { id: 2, action: "Consultation urgente programmée", time: "Il y a 15 min", type: "consultation" },
    { id: 3, action: "Mise à jour des tarifs", time: "Il y a 1 heure", type: "settings" },
    { id: 4, action: "Rapport mensuel généré", time: "Il y a 2 heures", type: "report" },
  ];

  // 🚨 FONCTION DE DÉCONNEXION UNIQUE AVEC REDIRECTION VERS /auth/login
  const handleLogout = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      try {
        // Appeler la fonction logout du contexte
        await logout();
        
        // Rediriger vers la page de login après la déconnexion
        router.push('/home');
        
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        // En cas d'erreur, rediriger quand même
        router.push('/auth/login');
      }
    }
  };

  // 🔐 APPLICATION DE LA PROTECTION PAR RÔLE
  // Seuls les ADMIN et SUPER_ADMIN peuvent accéder à cette page
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.SUPER_ADMIN]}>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-800">Clinique SantéPlus</h1>
                  <p className="text-sm text-slate-600">Tableau de bord administrateur</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Notifications */}
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </Button>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">Dr. {user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-slate-600">Administrateur</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Paramètres</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-slate-200 min-h-screen">
            <nav className="p-4 space-y-2">
              <Button 
                variant={activeTab === 'overview' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => router.push('/home')}
              >
                <Activity className="mr-3 h-4 w-4" />
                Page d'accueil
              </Button>
                 
              <Button 
                variant={activeTab === 'clinics' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => router.push('/cliniques')}
              >
                <Building className="mr-3 h-4 w-4" />
                Gestion des Cliniques
              </Button>
              <Button 
                variant={activeTab === 'clinics' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => router.push('/medical-services')} 
              >
                <Building className="mr-3 h-4 w-4" />
                  Services Médicaux
              </Button>
              <Button 
                variant={activeTab === 'clinics' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => router.push('/users')} 
              >
                <Building className="mr-3 h-4 w-4" />
                Gestion des staffs
              </Button>
              <Button 
                variant={activeTab === 'clinics' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => router.push('/equipment')} 
              >
                <Building className="mr-3 h-4 w-4" />
                Gestion des stocks
              </Button>
              <Button 
                variant={activeTab === 'clinics' ? 'default' : 'ghost'} 
                className="w-full justify-start"
                onClick={() => router.push('/medications')}
              >
                <Building className="mr-3 h-4 w-4" />
                Gestion des Médicaments
              </Button>
           

              {/* 🚨 BOUTON DE DÉCONNEXION AJOUTÉ DANS LA SIDEBAR */}
              <div className="pt-4 border-t border-slate-200">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                          <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                          <div className={`flex items-center mt-2 ${
                            stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            <TrendingUp className={`h-4 w-4 mr-1 ${
                              stat.trend === 'down' ? 'rotate-180' : ''
                            }`} />
                            <span className="text-sm font-medium">{stat.change}</span>
                          </div>
                        </div>
                        <div className={`p-3 rounded-full ${stat.bgColor}`}>
                          <Icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Graphiques */}
              <div className="lg:col-span-2 space-y-6">
                {/* Consultations par jour */}
                <Card>
                  <CardHeader>
                    <CardTitle>Consultations par Jour</CardTitle>
                    <CardDescription>Évolution des consultations sur la semaine</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={consultationData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="consultations" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Revenus mensuels */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenus Mensuels</CardTitle>
                    <CardDescription>Performance financière de la clinique</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar droite */}
              <div className="space-y-6">
                {/* Répartition des services */}
                <Card>
                  <CardHeader>
                    <CardTitle>Répartition des Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={serviceData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {serviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-4">
                      {serviceData.map((service, index) => (
                        <div key={service.name} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: COLORS[index] }}
                            />
                            <span className="text-sm">{service.name}</span>
                          </div>
                          <span className="text-sm font-medium">{service.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Activités récentes */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activités Récentes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">
                              {activity.action}
                            </p>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3 w-3 text-slate-400 mr-1" />
                              <span className="text-xs text-slate-500">{activity.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}