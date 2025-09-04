// /components/pages/LoginPage.tsx
'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { useDispatch } from 'react-redux';
import { authActions } from '@/store/authSlice';
import { Form, useForm } from 'react-hook-form';
import { Schema, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { FormData, LoginSchema } from '@/types/auth';
import FormField from '@/components/FormField';
import HideShowPassword from '@/components/HideShowPass';


export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useSearchParams();
  const from = params?.get('from') || '/home';

  const [showPassword, setShowPassword] = useState(false);


  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting, isValid }
  } = useForm<FormData>({
    resolver: zodResolver(LoginSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: { email: '', password: '' }
  });

const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post('/auth/login', { email: data.email, password: data.password });
      const { accessToken, user } = response.data;
      if (accessToken) {
        dispatch(authActions.setAccessToken(accessToken));
        dispatch(authActions.setUser(user));
        toast.success('Login successful');
        setTimeout(() => {
          router.push(from);
        }, 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const goToRegister = () => router.push('/register');

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-md">
        <Card className="card w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-lg font-extrabold" style={{ color: 'var(--text)' }}>
              Log in with your TConvo account
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-4">
              <div>
                <FormField
                  type="email"
                  className="input w-full"
                  placeholder="Email address"
                  register={register}
                  error={errors.email}
                  name="email"
                />
              </div>

              <div className="relative">
                <FormField
                  type={showPassword ? 'password' : 'text'}
                  className="input w-full"
                  placeholder="Password"
                  register={register}
                  error={errors.password}
                  name="password"
                  aria-label="password"
                />
                <HideShowPassword showPassword={showPassword} setShowPassword={setShowPassword} />
              </div>

              <div>
                <Button
                  className={`w-full rounded-xl bg-white text-black py-3 font-medium hover:opacity-95 transition
                    ${watch('email') && watch('password') !== '' ? 'cursor-pointer' : 'cursor-not-allowed text-gray-400'}`}
                >
                  Log in
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.03)]" />
                <div className="text-xs text-muted">or</div>
                <div className="flex-1 h-px bg-[rgba(255,255,255,0.03)]" />
              </div>

              <div className="text-center text-sm text-muted">
                <a href="/forgot" className="hover:underline">
                  Forgotten password?
                </a>
              </div>

              <div className='text-center text-sm text-muted'>
                Don&apos;t have an account? <span onClick={goToRegister} className="text-blue-500 hover:underline cursor-pointer">Sign up</span>
              </div>
            </form>
          </CardContent>

          <CardFooter className="p-4 justify-center">
            <div className="text-xs text-muted">© {new Date().getFullYear()} • TConvo Terms • Privacy Policy • Cookies Policy</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

