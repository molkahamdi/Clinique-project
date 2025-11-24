// app/unauthorized/page.tsx
'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function UnauthorizedPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-800 mb-4">
            Accès non autorisé
          </h1>
          
          <p className="text-slate-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
            {user && (
              <span className="block mt-2 text-sm">
                Votre rôle: <strong>{user.role}</strong>
              </span>
            )}
          </p>

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/home">
                <Home className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Tableau de bord principal
              </Link>
            </Button>

            <Button variant="ghost" onClick={logout} className="w-full">
              Se déconnecter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}