"use client";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  fetchUserByUsername,
  followUser,
  fetchFollowers,
  fetchFollowing,
} from "@/store/userSlice";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  selectProfile,
  selectFollowing,
  selectFollowers,
} from "@/store/userSlice";

export default function UserProfileClient({ username }: { username: string }) {
  const profile = useSelector(selectProfile);
  const Following = useSelector(selectFollowing);
  const Followers = useSelector(selectFollowers);
  const user = useSelector((s: RootState) => s.auth.user);
  const accessToken = useSelector((s: RootState) => s.auth.accessToken);
  // const [followersPreview, setFollowersPreview] = useState<IUser[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const handleFollow = async () => {
    const result = await dispatch(
      followUser({
        userId: user?.id as string,
        targetUserId: profile?._id as string,
        token: accessToken as string,
      })
    );
    if (followUser.fulfilled.match(result)) {
      console.log("Follow user successfully!");
    } else {
      console.error("Follow user failed");
    }
  };

  useEffect(() => {
    const load = async () => {
      const resultAction = await dispatch(
        fetchUserByUsername({ username, token: accessToken })
      );
      if (fetchUserByUsername.fulfilled.match(resultAction)) {
        console.log("User fetched successfully!");
      } else {
        console.error("Failed to fetch user");
      }
      const resultActionFollow = await dispatch(
        fetchFollowers({
          userId: user?.id as string,
          token: accessToken as string,
        })
      );
      if (fetchFollowers.fulfilled.match(resultActionFollow)) {
        console.log("Fetched followers successfully!");
      } else {
        console.error("Failed to fetch followers");
      }
      const resultActionFollowing = await dispatch(
        fetchFollowing({
          userId: user?.id as string,
          token: accessToken as string,
        })
      );
      if (fetchFollowing.fulfilled.match(resultActionFollowing)) {
        console.log("Fetched following successfully!");
      } else {
        console.error("Failed to fetch following");
      }
    };
    load();
  }, [dispatch, accessToken, username, user?.id]);

  // const followersSmall = useMemo(() => followersPreview.slice(0, 3), [followersPreview]);

  return (
    <>
      <div className="sticky top-0 md:row-span-1 text-center py-2 bg-[#0b0b0c] z-10">
        <div className="inline-block px-4 py-2 rounded-full text-white font-medium">
          <Button variant="ghost" className="hover:bg-white/5 cursor-pointer">
            {user?.username === profile?.username
              ? "Profile"
              : profile?.username}
          </Button>
        </div>
      </div>
      {/* Header card */}
      <div className="md:row-span-2">
        <Card className="card card-hover my-4 p-6 cursor-pointer">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">
                    {profile?.displayName ?? "—"}
                  </h1>
                  <div className="text-sm text-zinc-400 mt-1">
                    @{profile?.username}
                  </div>

                  <div className="flex items-center gap-3 mt-4">
                    {/* <div className="flex -space-x-2 items-center">
                    {followersSmall.map((f, i) => (
                      <div key={f.id ?? i} className="w-7 h-7 rounded-full overflow-hidden border border-zinc-800 avatar-ring">
                        {f.avatarUrl ? <Image src={f.avatarUrl} alt={f.username} className="object-cover w-full h-full" /> : <div className="bg-zinc-700 w-full h-full" />}
                      </div>
                    ))}
                  </div> */}
                    <div className="text-sm text-zinc-400">
                      {Followers.length} followers
                    </div>
                    <div className="text-sm text-zinc-400">
                      {Following.length} following
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-end">
                  <div className="w-20 h-20 rounded-full overflow-hidden border border-zinc-800">
                    {profile?.avatarUrl ? (
                      <Image
                        src={profile.avatarUrl}
                        alt="avatar"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-zinc-700 flex items-center justify-center text-white">
                        {profile?.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 w-full">
                    {user?.username === profile?.username ? (
                      <Button variant="outline" className="w-full">
                        Edit profile
                      </Button>
                    ) : (
                      <Button
                        className="w-full rounded-xl bg-white text-black py-3 font-medium hover:opacity-95 transition"
                        onClick={handleFollow}
                      >
                        Follow
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
