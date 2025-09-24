"use client";
import React from "react";
import { useParams } from "next/navigation";
import UserProfile from "@/app/(app)/home/profile/UserProfile";

export default function ProfilePage() {
  const { username } = useParams();
  return (
    <main className="md:grid-rows-3 max-w-2xl w-full left-0 right-0 mx-auto">
      <UserProfile username={username as string} />
    </main>
  );
}
