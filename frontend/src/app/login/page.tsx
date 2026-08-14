'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="md" />
        </div>
      </AuthLayout>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
