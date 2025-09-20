'use client';
import React, { useState } from 'react';
import { Home, Search, PlusSquare, Heart, User, LogOut } from 'lucide-react';
import Image from 'next/image';
import LeftNavModal from '@/components/LeftNavModal';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from "@/store";
import api from '@/lib/api';
import { authActions } from '@/store/authSlice';


export default function UnauthLeftNav() {
  const user = useSelector((s: RootState) => s.auth.user);
  const accessToken = useSelector((s: RootState) => s.auth.accessToken);
  const dispatch = useDispatch<AppDispatch>();
  const logoutHandler = async() => {
     try {
          const response = await api.post('/auth/logout', user, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          console.log(response);
          dispatch(authActions.logout());
        } catch (error) {
          console.error(error);
        }
  }

  const items = [
    { label: 'Home', icon: <Home size={20} />, key: 'home' },
    { label: 'Explore', icon: <Search size={20} />, key: 'explore' },
    { label: 'New', icon: <PlusSquare size={20} />, key: 'new' },
    { label: 'Likes', icon: <Heart size={20} />, key: 'likes' },
    { label: 'Profile', icon: <User size={20} />, key: 'profile' }
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title?: string; desc?: string } | null>(null);

  const openFor = (key: string) => {
    // Customize title/description per item if desired
    let title = 'Say more with TConvo';
    let desc = "Join TConvo to share thoughts, find out what's going on, follow your people and more.";
    if (key === 'explore') {
      title = 'Explore what’s happening';
      desc = 'Discover hashtags, creators and trending conversations.';
    }
    if (key === 'new') {
      title = 'Start a conversation';
      desc = 'Create posts, share photos, and engage with your community.';
    }
    if (key === 'likes') {
      title = 'See likes and reactions';
      desc = 'Log in to save and react to posts you enjoy.';
    }
    if (key === 'profile') {
      title = 'Your profile, your identity';
      desc = 'Create your account to build your profile and follow others.';
    }
    setModalContent({ title, desc });
    setModalOpen(true);
  };

  return (
    <div className="sticky top-6">
      <div className="flex flex-col items-center md:items-start gap-4 min-h-[calc(100vh-4rem)]">
        <div className="p-2 rounded-full hover:bg-white/5">
          <div className="w-11 h-11 rounded-full flex items-center justify-center bg-transparent border border-white/6">
            <Image src="/tconvoLogo.png" alt="Logo" width={44} height={44} className="rounded-full"  />
          </div>
        </div>

        <ul className="mt-6 space-y-4">
          {items.map(i => (
            <li key={i.key}>
              <button
                onClick={() => user ? alert('You are logged in') : openFor(i.key)}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/4 transition-colors cursor-pointer"
                aria-label={i.label}
              >
                <span className="text-gray-200">{i.icon}</span>
                <span className="hidden md:inline text-sm font-medium">{i.label}</span>
              </button>
            </li>
          ))}
        </ul>
         {
          user && (
            <div className="mt-auto">
          <button
            onClick={logoutHandler}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-white/4 transition-colors cursor-pointer"
          >
            <span className="text-gray-200"><LogOut size={20} /></span>
            <span className="hidden md:inline text-sm font-medium">Log out</span>
          </button>
        </div>
          )
         }
        
      </div>
      {/* Modal */}
      <LeftNavModal
        open={modalOpen}
        onOpenChange={(v) => setModalOpen(v)}
        title={modalContent?.title}
        description={modalContent?.desc}
        actionHref="/login"
      />
    </div>
  );
}

