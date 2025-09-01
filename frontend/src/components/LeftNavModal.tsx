// components/LeftNavModal.tsx
'use client';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
// import { Instagram } from 'lucide-react';

type LeftNavModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  showInstagram?: boolean;
  actionLabel?: string;
  actionHref?: string;
};

export default function LeftNavModal({
  open,
  onOpenChange,
  title = 'Say more with Threads',
  description = "Join Threads to share thoughts, find out what's going on, follow your people and more.",
  showInstagram = true,
  actionLabel = 'Continue with Instagram',
  actionHref = '/api/auth/instagram'
}: LeftNavModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-lg card p-0">
        <DialogHeader className="p-8 text-center">
          <DialogTitle>
            <div className="text-2xl font-extrabold" style={{ color: 'var(--text)' }}>{title}</div>
          </DialogTitle>
          <p className="text-sm text-muted mt-3">{description}</p>
        </DialogHeader>

        <div className="p-6 border-t border-[rgba(255,255,255,0.03)]">
          {showInstagram && (
            <div className="max-w-md mx-auto">
              <a
                href={actionHref}
                className="w-full inline-flex items-center gap-3 justify-center px-4 py-3 btn-primary rounded-xl border border-[rgba(255,255,255,0.04)]"
              >
                {/* <Instagram size={18} /> */}
                <span className="font-medium">{actionLabel}</span>
                <svg className="ml-auto w-4 h-4 opacity-80" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 5L13 10L7 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          )}
        </div>

        <DialogFooter className="p-4 text-center">
          <button onClick={() => onOpenChange(false)} className="text-sm text-muted">Close</button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
