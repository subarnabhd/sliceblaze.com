"use client";

import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';

const Homebanner = () => {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center justify-center h-[600px] bg-[#ED1D33] font-sans text-white">
      {/* Logo */}
      <Image
        src="/sliceblazelogo_white.svg"
        alt="SliceBlaze logo"
        width={300}
        height={60}
        priority
      />

      {/* Tagline */}
      <h1 className="mt-4 text-center text-[18px] font-semibold">
        Your Business Digital Partner
      </h1>

      {/* Search Bar */}
      <div className="mt-6 w-full max-w-2xl px-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for businesses, categories, or descriptions..."
            className="w-full px-5 py-3 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 hover:border-[#ED1D33] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent shadow-sm cursor-pointer transition-all"
            onClick={() => router.push("/search?focus=true")}
            onFocus={() => router.push("/search?focus=true")}
            readOnly
          />
          <button
            type="button"
            onClick={() => router.push("/search?focus=true")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-[#ED1D33] text-white rounded-md hover:bg-[#C91828] transition font-medium text-sm"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homebanner