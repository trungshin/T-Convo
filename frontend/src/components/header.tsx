// /components/Header.tsx
'use client';
import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Image from 'next/image'
import { RootState } from '@/store';
// import SearchBar from './ui/SearchBar';

export default function Header() {
  const user = useSelector((state: RootState) => state.auth.user);
  //const unread = useSelector((s: RootState) => s.notifications?.unreadCount ?? 0);
  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-2xl font-bold">T-Convo</Link>
        </div>
        {/* <SearchBar /> */}
        <div className="flex items-center gap-4">
          <Link href="/hashtags" className="text-sm text-gray-600">Explore</Link>
          <Link href="/notifications" className="relative">
            <span className="text-gray-700">🔔</span>
            {/* {unread > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">{unread}</span>} */}
          </Link>
          {user ? <Image src={user.avatarUrl ?? '/avatar.png'} className="w-8 h-8 rounded-full" alt="avatar" /> : <Link href="/login">Login</Link>}
        </div>
      </div>
    </header>
  );
}
