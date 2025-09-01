// components/UnauthHome.tsx
'use client';
import React from 'react';
// import Image from 'next/image'
import UnauthLeftNav from '@/components/UnauthLeftNav';
import UnauthPostPreview from '@/components/UnauthPostPreview';
import RightLoginCard from '@/components/RightLoginCard';

const SAMPLE_POSTS = [
  {
    id: 'p1',
    author: { username: 'sayword_b_eller', displayName: 'sayword b eller', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80' },
    community: 'Bookthreads',
    time: '13h',
    content: "If carrying a book with me or reading in public is pretentious and performative, I'm pretentious as fuck.",
    media: ['https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=800&q=80'],
    likes: 28,
    comments: 1,
    reposts: 5
  },
  {
    id: 'p2',
    author: { username: 'naturelover', displayName: 'Nature Lover', avatarUrl: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&q=80' },
    community: 'Wildlife',
    time: '1d',
    content: "A short gallery from today's beach outing — the iguanas were out in force!",
    media: [
      'https://images.unsplash.com/photo-1504274066651-8d31a536b11a?w=800&q=80',
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80'
    ],
    likes: 112,
    comments: 14,
    reposts: 22
  }
];

export default function UnauthHome() {
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-gray-100">
      <div className="max-w-full grid grid-cols-1  md:grid-cols-12 gap-6 pl-4">
        {/* Left nav */}
        <aside className="md:col-span-2">
          <UnauthLeftNav />
        </aside>

        {/* Center feed */}
        <div className='grid md:col-span-10 md:grid-cols-subgrid pr-10'>
          <main className="md:col-span-6 md:grid-rows-3">
            <div className="sticky top-0 md:row-span-1 text-center py-2 bg-[#0b0b0c] z-10">
              <div className="inline-block px-4 py-2 rounded-full bg-transparent border border-transparent text-white font-medium">Home</div>
            </div>
              <div className="md:row-span-2">
                {SAMPLE_POSTS.map(p => (
                  <UnauthPostPreview key={p.id} post={p} />
                ))}
              </div>
          </main>

          {/* Right login card */}
          <aside className="md:col-span-4 top-0">
            <RightLoginCard />
          </aside>
        </div>
      </div>
    </div>
  );
}
