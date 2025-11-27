'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { UserRole } from '@/lib/types';
import { useUser } from '@/hooks/use-users';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

// Définition explicite du type pour éviter les erreurs d'indexation
const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Admin',
  [UserRole.SUPER_ADMIN]: 'Super Admin',
  [UserRole.RECEP]: 'Réceptionniste',
  [UserRole.DOCTOR]: 'Docteur',
  [UserRole.PATIENT]: 'Patient',
};

export default function UserDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const role = searchParams.get('role') as UserRole;

  const { data: user, isLoading, error } = useUser(id, role);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p>Chargement...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-500">Utilisateur non trouvé</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fonction helper pour obtenir le label du rôle de manière sécurisée
  const getRoleLabel = (role: UserRole): string => {
    return roleLabels[role] || 'Rôle inconnu';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/users">
          <Button variant="outline">← Retour</Button>
        </Link>
        <h1 className="text-3xl font-bold">Détails de l'utilisateur</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {user.firstName} {user.lastName}
          </CardTitle>
          <CardDescription>Informations détaillées de l'utilisateur</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Prénom</label>
              <p className="text-lg">{user.firstName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Nom</label>
              <p className="text-lg">{user.lastName}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-lg">{user.email}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Téléphone</label>
            <p className="text-lg">{user.phone || '-'}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-500">Rôle</label>
            <div className="mt-1">
              <Badge variant="secondary">
                {getRoleLabel(user.role)}
              </Badge>
            </div>
          </div>

          {/* Affichage de la spécialité pour les docteurs */}
          {user.role === UserRole.DOCTOR && user.speciality && (
            <div>
              <label className="text-sm font-medium text-gray-500">Spécialité</label>
              <div className="flex items-center space-x-2 mt-1">
                <GraduationCap className="h-4 w-4 text-blue-500" />
                <p className="text-lg font-medium text-blue-600">{user.speciality}</p>
              </div>
            </div>
          )}

          {user.clinique && (
            <div>
              <label className="text-sm font-medium text-gray-500">Clinique</label>
              <p className="text-lg">{user.clinique.name}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}