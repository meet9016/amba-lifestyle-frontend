'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiClient, API_ENDPOINTS } from '@/lib/api';
import { registerSchema } from '@/lib/validations/auth';
import { Sparkles, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (generalError) setGeneralError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);

    // Zod validation
    const validationResult = registerSchema.safeParse(formData);
    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const pathKey = String(issue.path[0]);
        if (!formattedErrors[pathKey]) {
          formattedErrors[pathKey] = issue.message;
        }
      });
      setFormErrors(formattedErrors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        password: formData.password,
        role: 'customer'
      };

      const res = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, payload);

      if (res.data?.success || res.status === 201) {
        setIsSuccess(true);
        // Store session if token returned
        if (res.data?.data?.token) {
          localStorage.setItem('token', res.data.data.token);
        }
        if (res.data?.data?.user) {
          localStorage.setItem('user', JSON.stringify(res.data.data.user));
        }

        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Registration failed:', err);
      const serverMsg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setGeneralError(serverMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-amber-50/30 text-zinc-900">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white border border-amber-100/80 rounded-3xl p-6 sm:p-8 shadow-xl shadow-amber-950/5">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Connoisseur Club</span>
            </div>
            <h1 className="font-serif text-2xl font-bold text-zinc-900">
              Create Your Account
            </h1>
            <p className="text-xs text-zinc-500 mt-1.5">
              Join Amba Lifestyle for exclusive artisan curations, handloom previews, and priority bespoke orders.
            </p>
          </div>

          {/* Success State */}
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-bold text-base text-zinc-900">Welcome to Amba Lifestyle!</h2>
              <p className="text-xs text-zinc-500">
                Your customer account has been registered successfully. Redirecting you to the boutique...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {generalError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start gap-2 text-xs font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{generalError}</span>
                </div>
              )}

              <Input
                label="Full Name *"
                name="name"
                type="text"
                placeholder="e.g. Ananya Sharma"
                value={formData.name}
                onChange={handleInputChange}
                error={formErrors.name}
                className="bg-white text-zinc-900 border-zinc-200"
              />

              <Input
                label="Email Address *"
                name="email"
                type="email"
                placeholder="ananya@example.com"
                value={formData.email}
                onChange={handleInputChange}
                error={formErrors.email}
                className="bg-white text-zinc-900 border-zinc-200"
              />

              <Input
                label="Phone Number (Optional)"
                name="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={handleInputChange}
                error={formErrors.phone}
                className="bg-white text-zinc-900 border-zinc-200"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Password *"
                  name="password"
                  type="password"
                  placeholder="At least 6 chars"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={formErrors.password}
                  className="bg-white text-zinc-900 border-zinc-200"
                />

                <Input
                  label="Confirm Password *"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  error={formErrors.confirmPassword}
                  className="bg-white text-zinc-900 border-zinc-200"
                />
              </div>

              {/* Guarantees */}
              <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-500 border-t border-zinc-100">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Data Privacy
                </span>
                <span className="flex items-center gap-1">
                  <HeartHandshake className="w-3.5 h-3.5 text-amber-600" /> Artisan Community
                </span>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-semibold shadow-md shadow-amber-900/10 flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>

              <div className="text-center pt-2">
                <p className="text-xs text-zinc-500">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="font-semibold text-amber-800 hover:text-amber-900 underline underline-offset-4"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

