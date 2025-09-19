import React from 'react'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RootState } from '@/store';
import { IPost, IUser } from '@/types/post';
import Image from 'next/image';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';


export function PostCard({ post }: { post: IPost }) {
  // const user = useSelector((s: RootState) => s.auth.user);
  const { author, content, media, likesCount, commentsCount, createdAt } = post;
  console.log("media:", media);
  // const dispatch = useDispatch();
;
  return (
    <>
    <Card className="card card-hover my-4 cursor-pointer">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Avatar className="md">
                <AvatarImage src={author?.avatarUrl ?? undefined} alt={author?.displayName ?? author?.username} />
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm font-semibold !m-0">
                    {author?.displayName ?? author?.username}
                  </CardTitle>
                  {/* {post.community && (
                    <span className="text-xs text-muted px-2 py-0.5 rounded bg-white/2">{post.community}</span>
                  )} */}
                  <span className="text-xs text-muted">{moment(createdAt).fromNow()}</span>
                </div>
              </div>
              <div className="text-gray-400">•••</div>
            </div>
          </CardHeader>
    
          <CardContent>
            <p className="text-sm mb-3" style={{ color: 'var(--text)' }}>
              {content}
            </p>
    
            {media === null ? null : (
              <div className="mt-2">
                <Image
                  src={media as string}
                  alt="Post media"
                  width={500}
                  height={500}
                  className="border border-border h-full w-full rounded-md object-cover"
                />
              </div>
            )}
          </CardContent>
    
          <CardFooter>
            <div className="flex items-center gap-6 text-sm text-muted w-full">
              <div className="flex items-center gap-2">
                <span>♡</span>
                <span>{likesCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💬</span>
                <span>{commentsCount}</span>
              </div>
              {/* <div className="flex items-center gap-2">
                <span>🔁</span>
                <span>{reposts}</span>
              </div> */}
              <div className="ml-auto text-xs text-muted">Share</div>
            </div>
          </CardFooter>
        </Card>
    </>
  )
}
