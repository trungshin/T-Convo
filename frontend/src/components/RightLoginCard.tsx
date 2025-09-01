import React from 'react';
// import { Instagram } from 'lucide-react';

export default function RightLoginCard() {
  return (
    <div className="sticky top-14 text-center">
      <div className="bg-[#111115] border border-[#1f1f22] rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white">Log in or sign up for TConvo</h3>
        <p className="text-sm text-gray-400 mt-2">See what people are talking about and join the conversation.</p>

        <div className="mt-6">
          <button className="w-full flex items-center gap-3 justify-center px-4 py-3 bg-black/80 border border-white/10 rounded-xl text-white hover:opacity-95">
            {/* <Instagram size={18} /> */}
            <span className="font-medium">Continue with Instagram</span>
          </button>

          <div className="mt-4 text-center">
            <a href="/login" className="text-sm text-gray-400 hover:underline">Log in with username instead</a>
          </div>
        </div>
      </div>

      {/* small footer card */}
      <div className="mt-4 bg-transparent text-xs text-gray-500 p-3 rounded">
        <div>By continuing, you agree to TConvo Terms & Privacy Policy.</div>
      </div>
    </div>
  );
}
