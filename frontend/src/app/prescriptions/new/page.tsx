'use client';

import { useRouter } from 'next/navigation';
import { PrescriptionForm } from '@/components/prescriptions/PrescriptionForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewPrescriptionPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <PrescriptionForm
        onSuccess={() => {
          router.push('/prescriptions');
        }}
      />
    </div>
  );
}