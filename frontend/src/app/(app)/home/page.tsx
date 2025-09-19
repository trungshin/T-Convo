"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogFooter, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { IPost } from "@/types/post";
import { createPost, fetchPosts } from "@/store/postSlice";
import { PostCard } from "@/components/PostCard";
import InputDemo from "@/components/input-12";

export default function AppPage() {
  const [open, setOpen] = useState(false);
  const user = useSelector((s: RootState) => s.auth.user);
  const accessToken = useSelector((s: RootState) => s.auth.accessToken);
  const posts = useSelector((s: RootState) => s.posts.posts);
  console.log("Posts in state: ", posts);
  // const { isLoading, error } = useSelector((state: RootState) => state.posts);
  const [content, setContent] = useState('');
  // const [author, setAuthor] = useState('');
  const [mediaFiles, setMediaFiles] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const handleCreatePost = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!user) return;
    const newPost = {
      content,
      author: user,
      media: mediaFiles,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date().toISOString()
    };
    console.log("New Post Data: ", newPost);
    const result = await dispatch(createPost({newPost, token: accessToken!}));
    if (createPost.fulfilled.match(result)) {
      // Optional: Clear form hoặc show success toast
      setContent('');
      setMediaFiles(null);
      setOpen(false);
      console.log('Post created successfully!');
    } else {
      // Error đã được set trong extraReducers, chỉ cần hiển thị
      console.error('Failed to create post');
    }
  }
  useEffect(() => {
    const loadPosts = async () => {
      if (!accessToken) return;
      const resultAction = await dispatch(fetchPosts(accessToken));
      console.log("resultAction:", resultAction);
      if (fetchPosts.fulfilled.match(resultAction)) {
        console.log('Posts fetched successfully!');
      } else {
        console.error('Failed to fetch posts');
      }
    };
    loadPosts();
  }, [dispatch, accessToken, posts.length]);

  return (
    <>
      <main className="md:grid-rows-3 max-w-2xl w-full left-0 right-0 mx-auto">
        <div className="sticky top-0 md:row-span-1 text-center py-2 bg-[#0b0b0c] z-10">
          <div className="inline-block px-4 py-2 rounded-full text-white font-medium">
            <Button variant="ghost" className="hover:bg-white/5 cursor-pointer">
              For you
            </Button>
            <Button variant="ghost" className="hover:bg-white/5 cursor-pointer">
              Following
            </Button>
          </div>
        </div>
        <div className="md:row-span-2">
          <Card className="card card-hover my-4 cursor-pointer">
            <CardContent>
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage
                    src={user?.avatarUrl ?? undefined}
                    alt={user?.displayName ?? user?.username}
                  />
                </Avatar>
                <div className="flex-1">
                  <div
                    className="w-full rounded-md bg-zinc-900 border border-zinc-800 py-3 px-4 text-zinc-500 cursor-text"
                    onClick={() => setOpen(true)}
                  >
                    What&apos;s new?
                  </div>
                </div>
                <Button
                  className="px-3 m-auto rounded-md border border-zinc-700 text-sm text-zinc-200 hover:bg-white/5 cursor-pointer"
                  onClick={() => setOpen(true)}
                >
                  Post
                </Button>
              </div>
            </CardContent>
          </Card>
          {posts.length > 0 ? posts.map((post) => (<PostCard key={post._id} post={post} />)) : <div>No posts available.</div>}
        </div>
      </main>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[72vh] max-w-2xl w-full rounded-2xl top-50 ml-30 overflow-hidden bg-[#0b0b0b] border border-zinc-700 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-zinc-400"
            >
              Cancel
            </button>
            <DialogTitle>New convo</DialogTitle>
            {/* <div className="font-semibold">New convo</div> */}
            <div className="w-12" />
          </div>

          {/* Body: Composer */}
          <div className="px-6 py-4 overflow-auto">
            {/* user row */}
            <div className="flex items-start gap-3">
              {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.username}
                  width={44}
                  height={44}
                  className="rounded-full"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-zinc-700 flex items-center justify-center text-white">
                  {(user?.username || "U")[0].toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">
                    {user?.displayName || user?.username}
                  </div>
                  <div className="text-xs text-zinc-500">› Add a topic</div>
                </div>

                <div className="mt-3">
                  <Input
                    placeholder="What's on your mind?"
                    className="bg-zinc-900 border border-zinc-800 text-zinc-500"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <InputDemo media={mediaFiles} setMedia={setMediaFiles} />
                </div>
              </div>
            </div>
          </div>
            
          <Button onClick={handleCreatePost} className="ml-auto rounded-md border border-zinc-700 text-sm text-zinc-200 hover:bg-white/5">
            Post
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
