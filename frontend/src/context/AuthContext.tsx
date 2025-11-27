'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { UserRole, type AuthResponse, type LoginDto, type RegisterDto, type User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log('🔄 Vérification de l\'authentification...');
      
      if (apiClient.isAuthenticated()) {
        console.log('✅ Token présent, récupération des infos utilisateur');
        const currentUser = await apiClient.getCurrentUser();
        console.log('👤 Utilisateur connecté:', currentUser);
        
        // Créer l'objet user avec toutes les propriétés requises
        const userData: User = {
          id: currentUser.id,
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          phone: currentUser.phone || '',
          speciality: currentUser.speciality,
          role: currentUser.role,
          dateOfBirth: currentUser.dateOfBirth || '', // Ajout de dateOfBirth
          createdAt: currentUser.createdAt || '',
          updatedAt: currentUser.updatedAt || '',
        };
        
        setUser(userData);
      } else {
        console.log('❌ Aucun token, utilisateur non authentifié');
        setUser(null);
      }
    } catch (error) {
      console.error('💥 Erreur vérification auth:', error);
      apiClient.logout();
      setUser(null);
    } finally {
      console.log('🏁 Fin de la vérification auth, loading: false');
      setLoading(false);
    }
  };

  const login = async (data: LoginDto) => {
    try {
      console.log('🔐 Tentative de connexion...');
      const response: AuthResponse = await apiClient.login(data);
      console.log('✅ Connexion réussie:', response);
      
      // Créer l'objet user complet avec toutes les propriétés
      const userData: User = {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        phone: response.phone || '',
        role: response.role,
        speciality: response.speciality,
        dateOfBirth: response.dateOfBirth || '', // Ajout de dateOfBirth
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };
      
      setUser(userData);
      
      // Redirection basée sur le rôle
      if (response.role === UserRole.ADMIN || response.role === UserRole.SUPER_ADMIN) {
        router.push('/dashboard-admin');
      } else if (response.role === UserRole.PATIENT) {
        router.push('/patient-dashboard');
      } else if (response.role === UserRole.DOCTOR) {
        router.push('/doctor-dashboard');
      } else {
        router.push('/receptionist-dashboard');
      }
    } catch (error) {
      console.error('❌ Erreur connexion:', error);
      throw error;
    }
  };

  const register = async (data: RegisterDto) => {
    try {
      const response: AuthResponse = await apiClient.register(data);
      
      // Créer l'objet user complet avec toutes les propriétés
      const userData: User = {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        phone: response.phone || '',
        speciality: response.speciality,
        role: response.role,
        dateOfBirth: response.dateOfBirth || '', // Ajout de dateOfBirth
        createdAt: response.createdAt,
        updatedAt: response.updatedAt,
      };
      
      setUser(userData);
      router.push('/dashboard');
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('🚪 Déconnexion...');
    apiClient.logout();
    setUser(null);
    router.push('/home');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}