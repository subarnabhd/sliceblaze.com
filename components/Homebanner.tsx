"use client";

import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';


const Homebanner = () => {
  const router = useRouter();
  return (
    <section className="flex flex-col items-center justify-center min-h-[50vh] w-full bg-white py-16 px-4">
      {/* Logo */}

      <Image
        src="/sliceicon.svg"
        alt="SliceBlaze logo"
        width={150}
        height={40}
        priority
        className="mb-6"
      />

      {/* Tagline */}
      <h1 className="text-center text-2xl sm:text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight leading-tight">
        Your Business <span className="text-[#ED1D33]">Digital Partner</span>
      </h1>
      <p className="text-center text-sm sm:text-base md:text-xl text-gray-600 max-w-2xl mb-10 font-medium leading-relaxed">
        Empowering your business with digital slice.
      </p>

      {/* Search Bar */}
      <div className="w-full max-w-xl px-2">
        <div className="relative flex items-center bg-white rounded-xl shadow border border-gray-200">
          <input
            type="text"
            placeholder="Search for businesses, categories, or descriptions..."
            className="w-full px-6 py-3 rounded-xl bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ED1D33] focus:border-transparent text-sm sm:text-base md:text-lg"
            onClick={() => router.push("/search?focus=true")}
            onFocus={() => router.push("/search?focus=true")}
            readOnly
          />
          <button
            type="button"
            onClick={() => router.push("/search?focus=true")}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#ED1D33] text-white rounded-lg hover:bg-[#C91828] transition font-semibold text-sm sm:text-base md:text-lg shadow"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}

export default Homebanner