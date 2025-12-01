'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, Users, Building, MapPin, Phone, Mail, Search } from 'lucide-react';
import { cliniqueApi } from '@/lib/api/clinique';
import { Clinique } from '@/types/clinique';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function CliniquesPage() {
  const [cliniques, setCliniques] = useState<Clinique[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    loadCliniques();
  }, []);

  const loadCliniques = async () => {
    try {
      setLoading(true);
      const data = await cliniqueApi.getAll();
      setCliniques(data);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de charger les cliniques',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await cliniqueApi.delete(deleteId);
      toast({
        title: 'Succès',
        description: 'Clinique supprimée avec succès',
      });
      loadCliniques();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erreur',
        description: error.message || 'Impossible de supprimer la clinique',
      });
    } finally {
      setDeleteId(null);
    }
  };

  const filteredCliniques = cliniques.filter(clinique =>
    clinique.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinique.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinique.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    clinique.phone.includes(searchTerm)
  );

  const stats = {
    total: cliniques.length,
    active: cliniques.length, // Toutes les cliniques sont considérées comme actives
    withEmail: cliniques.filter(c => c.email).length,
    withPhone: cliniques.filter(c => c.phone).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des cliniques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-sm">
              <Building className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Cliniques</h1>
              <p className="text-gray-600 mt-1">Administration complète de votre réseau de cliniques</p>
            </div>
          </div>
          
          <Button 
            onClick={() => router.push('/cliniques/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle Clinique
          </Button>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Cliniques</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Cliniques Actives</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.active}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          

    
        </div>

        {/* Carte principale */}
        <Card className="bg-white border border-gray-200 shadow-lg">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Liste des Cliniques</CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  Consultez et gérez toutes les cliniques de votre réseau
                </CardDescription>
              </div>
              <div className="flex items-center space-x-3 mt-4 lg:mt-0">
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                  {filteredCliniques.length} cliniques
                </Badge>
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="flex flex-col lg:flex-row gap-4 mt-6">
              <div className="flex-1 relative">
                <Input
                  placeholder="Rechercher une clinique par nom, adresse, email ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-blue-500 transition-colors h-11"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-900 py-4">Clinique</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4">Coordonnées</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4">Contact</TableHead>
                    <TableHead className="font-semibold text-gray-900 py-4 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCliniques.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center">
                          <Building className="h-12 w-12 text-gray-400 mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 mb-2">Aucune clinique trouvée</h3>
                          <p className="text-gray-500 max-w-sm text-center">
                            {searchTerm 
                              ? 'Aucune clinique ne correspond à vos critères de recherche.' 
                              : 'Aucune clinique n\'a été créée pour le moment.'
                            }
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCliniques.map((clinique) => (
                      <TableRow key={clinique.id} className="hover:bg-gray-50/80 transition-colors border-b border-gray-100 last:border-b-0 group">
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                              <Building className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{clinique.name}</p>
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-1">
                                Active
                              </Badge>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-700 line-clamp-1">{clinique.address}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-700">{clinique.phone}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-700">{clinique.email}</span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell className="py-4">
                          <div className="flex justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/cliniques/${clinique.id}`)}
                              className="hover:bg-gray-100 text-gray-600"
                              title="Voir détails"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/cliniques/${clinique.id}/assign-users`)}
                              className="hover:bg-purple-50 text-purple-600"
                              title="Assigner des utilisateurs"
                            >
                              <Users className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/cliniques/${clinique.id}/edit`)}
                              className="hover:bg-blue-50 text-blue-600"
                              title="Modifier"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(clinique.id)}
                              className="hover:bg-red-50 text-red-600"
                              title="Supprimer"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center space-x-2 text-gray-900">
              <Trash2 className="w-5 h-5 text-red-600" />
              <span>Confirmer la suppression</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Êtes-vous sûr de vouloir supprimer la clinique "{cliniques.find(c => c.id === deleteId)?.name}" ? 
              Cette action est irréversible et supprimera définitivement la clinique et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}