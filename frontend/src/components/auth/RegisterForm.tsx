'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FormInput from './FormInput';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

interface PasswordRequirement {
  label: string;
  test: (pw: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'One number', test: (pw) => /[0-9]/.test(pw) },
];

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordChecks = useMemo(() => {
    return passwordRequirements.map((req) => ({
      ...req,
      met: req.test(password),
    }));
  }, [password]);

  const allPasswordMet = passwordChecks.every((c) => c.met);

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!allPasswordMet) {
      newErrors.password = 'Password does not meet all requirements';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).filter((k) => k !== 'general').length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await register(email.trim(), password);
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrors({ general: message });
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Account created!</h2>
        <p className="mt-1 text-sm text-gray-500">Redirecting to sign in...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-2 text-2xl font-bold text-gray-900">Create an account</h2>
      <p className="mb-6 text-sm text-gray-500">
        Get started with Vaultly today
      </p>

      {errors.general && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          label="Full name"
          type="text"
          placeholder="Alex Morgan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
          autoComplete="name"
          disabled={isLoading}
        />

        <FormInput
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
          disabled={isLoading}
        />

        <div>
          <FormInput
            label="Password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="new-password"
            disabled={isLoading}
          />
          {password.length > 0 && (
            <div className="mt-2 space-y-1">
              {passwordChecks.map((check) => (
                <div key={check.label} className="flex items-center gap-2 text-xs">
                  <svg
                    className={`h-3.5 w-3.5 shrink-0 ${check.met ? 'text-green-500' : 'text-gray-300'}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    {check.met ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    )}
                  </svg>
                  <span className={check.met ? 'text-green-600' : 'text-gray-500'}>
                    {check.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <FormInput
          label="Confirm password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
          disabled={isLoading}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account...
            </span>
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-vaultly-600 hover:text-vaultly-700"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
