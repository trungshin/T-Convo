// app/page.tsx
'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import  UnauthHome from '@/components/UnauthHome';
import AppPage from '@/app/(app)/home/page';

export default function Page() {
  const user = useSelector((s: RootState) => s.auth.user);
  return (
    <>
      {user ? <AppPage /> : <UnauthHome />}
    </>
  );
}
