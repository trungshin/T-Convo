'use client';
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShowPasswordProps } from '@/types/auth';

export default function HideShowPassword({ showPassword, setShowPassword }: ShowPasswordProps) {
  return (
    <>
      <Button
        type="button"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
        aria-pressed={showPassword}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-2 flex items-center text-muted hover:text-white/80 cursor-pointer"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </Button>
    </>
  );
}
