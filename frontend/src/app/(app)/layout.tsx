// app/(app)/layout.tsx
"use client";
import React from "react";
import UnauthLeftNav from "@/components/UnauthLeftNav";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import UnauthHome from "@/components/UnauthHome";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useSelector((s: RootState) => s.auth.user);
  return (
    <>
      {user ? (
        <div className="min-h-screen bg-[#0b0b0c] text-gray-100">
          <div className="max-w-full grid grid-cols-1  md:grid-cols-12 gap-6 pl-4">
            <aside className="md:col-span-2">
              <UnauthLeftNav />
            </aside>
            <div className="md:col-span-10 max-w-full min-h-screen flex flex-col items-start pl-10 border-x border-zinc-800">
              {children}
            </div>
          </div>
        </div>
      ) : (
        <UnauthHome />
      )}
    </>
  );
}
