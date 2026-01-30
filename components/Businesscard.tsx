"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface BusinesscardProps {
  username: string;
  name: string;
  address?: string;
  category?: string;
  business_logo?: string;
}
}

export default function Businesscard({
  username,
  name,
  address,
  category,
  business_logo,
}: BusinesscardProps) {
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
        <span className="block mt-4 text-sm font-medium text-red-500">
          Explore →
        </span>
      </div>
    </Link>
  );
}
