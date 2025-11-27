'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { PrescriptionForm } from '@/components/prescriptions/PrescriptionForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewPrescriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patientId');

  const initialData = patientId ? { patientId } : undefined;

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
        initialData={initialData}
        onSuccess={() => {
          router.push('/prescriptions');
        }}
      />
    </div>
  );
}