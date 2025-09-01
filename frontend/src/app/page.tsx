// app/page.tsx
'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import  UnauthHome from '@/components/UnauthHome';
//import Feed from '@/components/Feed'; // nếu có feed cho logged in

export default function Page() {
  const user = useSelector((s: RootState) => s.auth.user);
  return (
    <>
      {user ? <div>T-Convo</div> : <UnauthHome />}
    </>
  );
}
