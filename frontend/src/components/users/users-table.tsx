'use client';

import { User, UserRole } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, Mail, Phone, MoreVertical, Eye, GraduationCap } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useState, useEffect } from 'react';

interface UsersTableProps {
  users: User[];
  onDelete: (id: string, role: UserRole) => void;
  isDeleting?: boolean;
  searchTerm?: string;
}

const roleConfig = {
  [UserRole.ADMIN]: { 
    label: 'Administrateur', 
    class: 'bg-purple-100 text-purple-800 border-purple-200',
    accent: 'bg-purple-500'
  },
  [UserRole.SUPER_ADMIN]: { 
    label: 'Super Admin', 
    class: 'bg-red-100 text-red-800 border-red-200',
    accent: 'bg-red-500'
  },
  [UserRole.DOCTOR]: { 
    label: 'Médecin', 
    class: 'bg-blue-100 text-blue-800 border-blue-200',
    accent: 'bg-blue-500'
  },
  [UserRole.RECEP]: { 
    label: 'Réceptionniste', 
    class: 'bg-green-100 text-green-800 border-green-200',
    accent: 'bg-green-500'
  },
  [UserRole.PATIENT]: { 
    label: 'Patient', 
    class: 'bg-orange-100 text-orange-800 border-orange-200',
    accent: 'bg-orange-500'
  },
};

export function UsersTable({ users, onDelete, isDeleting, searchTerm = '' }: UsersTableProps) {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm)) ||
        (user.speciality && user.speciality.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [users, searchTerm]);

  const getRoleBadge = (role: UserRole) => {
    const config = roleConfig[role];
    return (
      <Badge variant="secondary" className={config.class}>
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${config.accent}`}></div>
          <span>{config.label}</span>
        </div>
      </Badge>
    );
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (filteredUsers.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucun utilisateur trouvé</h3>
        <p className="text-gray-500 max-w-sm mx-auto">
          {searchTerm ? 
            `Aucun utilisateur ne correspond à "${searchTerm}"` : 
            'Aucun utilisateur ne correspond aux critères de filtrage.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
            <TableHead className="font-semibold text-gray-900 py-4">Utilisateur</TableHead>
            <TableHead className="font-semibold text-gray-900 py-4">Rôle</TableHead>
            <TableHead className="font-semibold text-gray-900 py-4">Contact</TableHead>
            <TableHead className="font-semibold text-gray-900 py-4">Spécialité</TableHead>
            <TableHead className="font-semibold text-gray-900 py-4">Date de création</TableHead>
            <TableHead className="font-semibold text-gray-900 py-4">Statut</TableHead>
            <TableHead className="font-semibold text-gray-900 py-4 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow 
              key={user.id} 
              className="hover:bg-gray-50/80 transition-colors border-b border-gray-100 last:border-b-0 group"
            >
              <TableCell className="py-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border border-gray-200 shadow-sm">
                    <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback className="bg-gray-100 text-gray-600 font-medium">
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">ID: {user.id.slice(0, 8)}...</p>
                  </div>
                </div>
              </TableCell>
              
              <TableCell className="py-4">
                {getRoleBadge(user.role)}
              </TableCell>
              
              <TableCell className="py-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-3 w-3 text-gray-400" />
                    <span className="text-gray-700">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span className="text-gray-700">{user.phone}</span>
                    </div>
                  )}
                </div>
              </TableCell>

              {/* CORRECTION ICI : Vérifier si la spécialité n'est pas vide */}
              <TableCell className="py-4">
                {user.role === UserRole.DOCTOR && user.speciality && user.speciality.trim() !== '' ? (
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="h-3 w-3 text-blue-500" />
                    <span className="text-sm text-gray-700 font-medium">{user.speciality}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">-</span>
                )}
              </TableCell>

              <TableCell className="py-4">
                <div className="text-sm text-gray-600">
                  {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                </div>
              </TableCell>
              
              <TableCell className="py-4">
                <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                  Actif
                </Badge>
              </TableCell>
              
              <TableCell className="py-4">
                <div className="flex justify-end space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                  >
                    <Eye className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-50 text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(user.id, user.role)}
                    disabled={isDeleting}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 text-red-600 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="text-sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir le profil
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm">
                        <Mail className="h-4 w-4 mr-2" />
                        Envoyer un email
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-sm text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}