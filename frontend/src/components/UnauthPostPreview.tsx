import React from 'react';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from 'next/image';

type Post = {
  id: string;
  author: { username: string; displayName?: string; avatarUrl?: string };
  community?: string;
  time?: string;
  content: string;
  media: string[];
  likes: number;
  comments: number;
  reposts: number;
};

export default function UnauthPostPreview({ post }: { post: Post }) {
  const { author, community, time, content, media, likes, comments, reposts } = post;

  return (
    <Card className="card card-hover my-4 cursor-pointer">
      <CardHeader>
        <div className="flex items-start gap-3">
          <Avatar className="md">
            <AvatarImage src={author.avatarUrl ?? undefined} alt={author.displayName ?? author.username} />
          </Avatar> 
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold !m-0">
                {author.displayName ?? author.username}
              </CardTitle>
              {community && (
                <span className="text-xs text-muted px-2 py-0.5 rounded bg-white/2">{community}</span>
              )}
              <span className="text-xs text-muted">{time}</span>
            </div>
          </div>
          <div className="text-gray-400">•••</div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm mb-3" style={{ color: 'var(--text)' }}>
          {content}
        </p>

        {media && media.length > 0 && (
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 media-grid">
              {media.map((m, idx) => (
                <Image key={idx} src={m} alt={`media-${idx}`} className="rounded-md object-cover w-full max-h-64" width={500} height={300} />
              ))}
            </div>
          )}
      </CardContent>

      <CardFooter>
        <div className="flex items-center gap-6 text-sm text-muted w-full">
          <div className="flex items-center gap-2">
            <span>♡</span>
            <span>{likes}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>💬</span>
            <span>{comments}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>🔁</span>
            <span>{reposts}</span>
          </div>
          <div className="ml-auto text-xs text-muted">Share</div>
        </div>
      </CardFooter>
    </Card>
  );
}
