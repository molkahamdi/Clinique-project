'use client';

import { useForm } from 'react-hook-form';
import { CreateUserDto, UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Stethoscope, UserCog, Users, LucideProps } from 'lucide-react';
import { ForwardRefExoticComponent, RefAttributes } from 'react';

interface UserFormProps {
  onSubmit: (data: CreateUserDto) => void;
  isLoading?: boolean;
  initialData?: Partial<CreateUserDto>;
  isEdit?: boolean;
}

interface RoleOption {
  value: UserRole;
  label: string;
  description: string;
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
  color: string;
}

const roleOptions: RoleOption[] = [
  { 
    value: UserRole.ADMIN, 
    label: 'Administrateur',
    description: 'Accès complet au système',
    icon: Shield,
    color: 'text-purple-600 bg-purple-50'
  },
  { 
    value: UserRole.DOCTOR, 
    label: 'Médecin',
    description: 'Personnel médical',
    icon: Stethoscope,
    color: 'text-blue-600 bg-blue-50'
  },
  { 
    value: UserRole.RECEP, 
    label: 'Réceptionniste',
    description: 'Accueil et gestion des rendez-vous',
    icon: UserCog,
    color: 'text-green-600 bg-green-50'
  },
  { 
    value: UserRole.PATIENT, 
    label: 'Patient',
    description: 'Utilisateur patient',
    icon: Users,
    color: 'text-orange-600 bg-orange-50'
  },
];

// Liste des spécialités médicales
const medicalSpecialities = [
  'Cardiologie',
  'Dermatologie',
  'Gynécologie',
  'Pédiatrie',
  'Neurologie',
  'Orthopédie',
  'Ophtalmologie',
  'Psychiatrie',
  'Radiologie',
  'Chirurgie',
  'Médecine générale',
  'Dentiste',
  'ORL',
  'Urologie',
  'Endocrinologie'
];

export function UserForm({ 
  onSubmit, 
  isLoading = false, 
  initialData,
  isEdit = false 
}: UserFormProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [showRoleSelection, setShowRoleSelection] = useState(!initialData?.role);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm<CreateUserDto>({
    defaultValues: initialData,
  });

  const phoneValue = watch('phone');
  const roleValue = watch('role');

  useEffect(() => {
    if (initialData?.role) {
      setSelectedRole(initialData.role);
      setValue('role', initialData.role);
    }
  }, [initialData, setValue]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setValue('role', role);
    setShowRoleSelection(false);
  };

  const validatePhone = (phone: string | undefined) => {
    if (!phone || phone.trim() === '') {
      return true;
    }
    
    const cleanedPhone = phone.replace(/\D/g, '');
    
    if (cleanedPhone.length !== 8) {
      return 'Le numéro de téléphone doit contenir exactement 8 chiffres';
    }
    
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cleanedValue = value.replace(/\D/g, '');
    
    setValue('phone', cleanedValue, { shouldValidate: true });
    
    if (errors.phone) {
      clearErrors('phone');
    }
  };

  const handleFormSubmit = (data: CreateUserDto) => {
    if (!data.role) {
      setError('role', { message: 'Veuillez sélectionner un rôle' });
      return;
    }

    if (data.phone && data.phone.length !== 8) {
      setError('phone', { message: 'Le numéro de téléphone doit contenir exactement 8 chiffres' });
      return;
    }

    // Validation spécialité pour les docteurs
    if (data.role === UserRole.DOCTOR && !data.speciality) {
      setError('speciality', { message: 'La spécialité est requise pour un médecin' });
      return;
    }

    onSubmit(data);
  };

  if (showRoleSelection) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Sélectionnez le type d'utilisateur</h3>
          <p className="text-gray-600">Choisissez le rôle approprié pour le nouvel utilisateur</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roleOptions.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card 
                key={role.value}
                className="cursor-pointer border-2 border-transparent hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                onClick={() => handleRoleSelect(role.value)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${role.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{role.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const selectedRoleConfig = roleOptions.find(role => role.value === selectedRole);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {selectedRole && selectedRoleConfig && (
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${selectedRoleConfig.color}`}>
                  <selectedRoleConfig.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Création d'un {selectedRoleConfig.label.toLowerCase()}</p>
                  <p className="text-sm text-gray-600">{selectedRoleConfig.description}</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowRoleSelection(true)}
                className="text-gray-600 hover:text-gray-900"
              >
                Changer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              Prénom *
            </Label>
            <Input
              id="firstName"
              placeholder="Entrez le prénom"
              {...register('firstName', { 
                required: 'Le prénom est requis',
                minLength: {
                  value: 2,
                  message: 'Le prénom doit contenir au moins 2 caractères'
                }
              })}
              className="mt-1"
            />
            {errors.firstName && (
              <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@exemple.com"
              {...register('email', {
                required: 'L\'email est requis',
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: 'Format d\'email invalide',
                },
              })}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Champ spécialité pour les docteurs */}
          {roleValue === UserRole.DOCTOR && (
            <div>
              <Label htmlFor="speciality" className="text-sm font-medium text-gray-700">
                Spécialité *
              </Label>
              <Select
                onValueChange={(value) => setValue('speciality', value)}
                defaultValue={initialData?.speciality}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez une spécialité" />
                </SelectTrigger>
                <SelectContent>
                  {medicalSpecialities.map((speciality) => (
                    <SelectItem key={speciality} value={speciality}>
                      {speciality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.speciality && (
                <p className="text-red-600 text-sm mt-1">{errors.speciality.message}</p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Nom *
            </Label>
            <Input
              id="lastName"
              placeholder="Entrez le nom"
              {...register('lastName', { 
                required: 'Le nom est requis',
                minLength: {
                  value: 2,
                  message: 'Le nom doit contenir au moins 2 caractères'
                }
              })}
              className="mt-1"
            />
            {errors.lastName && (
              <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              Téléphone
            </Label>
            <Input
              id="phone"
              placeholder="12345678 (8 chiffres)"
              value={phoneValue || ''}
              {...register('phone', {
                validate: validatePhone,
                pattern: {
                  value: /^\d*$/,
                  message: 'Seuls les chiffres sont autorisés'
                }
              })}
              onChange={handlePhoneChange}
              maxLength={8}
              className="mt-1"
            />
            {errors.phone && (
              <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Format attendu : 8 chiffres (ex: 12345678)
            </p>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              {isEdit ? 'Nouveau mot de passe' : 'Mot de passe *'}
            </Label>
            <Input
              id="password"
              type="password"
              placeholder={isEdit ? "Laisser vide pour ne pas changer" : "Minimum 6 caractères"}
              {...register('password', {
                required: isEdit ? false : 'Le mot de passe est requis',
                minLength: {
                  value: 6,
                  message: 'Le mot de passe doit contenir au moins 6 caractères',
                },
              })}
              className="mt-1"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Champ rôle caché pour la validation */}
      <input 
        type="hidden" 
        {...register('role', { 
          required: 'Le rôle est requis',
          validate: (value) => value ? true : 'Le rôle est requis'
        })} 
      />
      {errors.role && (
        <p className="text-red-600 text-sm">{errors.role.message}</p>
      )}

      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isLoading}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !selectedRole}
          className="bg-blue-600 hover:bg-blue-700 text-white min-w-32"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{isEdit ? 'Mise à jour...' : 'Création...'}</span>
            </div>
          ) : (
            isEdit ? 'Mettre à jour' : 'Créer l\'utilisateur'
          )}
        </Button>
      </div>
    </form>
  );
}