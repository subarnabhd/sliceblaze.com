"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface BusinessProfileCardProps {
  username: string;
  name: string;
  address?: string;
  category?: string;
  business_logo?: string;
  brand_primary_color?: string;
  brand_secondary_color?: string;
}


export default function BusinessProfileCard({
  username,
  name,
  address,
  category,
  business_logo,
  brand_primary_color = '#ED1D33',
  brand_secondary_color = '#C91828',
}: BusinessProfileCardProps) {
  const [imgSrc, setImgSrc] = useState(business_logo || "/sample.svg");

  return (
    <Link
      href={`/${username}`}
      className="max-w-70 flex flex-col gap-4 p-6 rounded-2xl bg-white border border-gray-300 overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex justify-center items-center">
        <Image
          src={imgSrc}
          alt={name}
          width={194}
          height={194}
          priority
          className="object-contain rounded-xl"
          onError={() => setImgSrc("/sample.svg")}
        />
      </div>

      <div>
        <h3 className="text-base font-semibold text-gray-900">{name}</h3>
        {address && (
          <p className="text-sm text-gray-500 mt-1">{address}</p>
        )}
        {category && (
          <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-red-50 text-red-500">
            {category}
          </span>
        )}
        <span
          className="block mt-4 text-sm font-medium text-white rounded-lg px-4 py-2 cursor-pointer transition-colors duration-200"
          style={{
            backgroundColor: brand_primary_color,
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLSpanElement).style.backgroundColor = brand_secondary_color;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLSpanElement).style.backgroundColor = brand_primary_color;
          }}
        >
          Explore →
        </span>
      </div>
    </Link>
  );
}
