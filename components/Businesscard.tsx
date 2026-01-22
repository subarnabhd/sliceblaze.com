"use client";

import { useState } from "react";
import Image from "next/image";

interface BusinessCardProps {
  name: string;
  location: string;
  category: string;
  image: string;
}

export default function BusinessCard({
  name,
  location,
  category,
  image,
}: BusinessCardProps) {
  const [imgSrc, setImgSrc] = useState(image || "/sample.svg");

  return (
    <div className="w-[280px] flex flex-col gap-10 p-10 rounded-2xl bg-white border border-gray-300 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="flex justify-center items-center">
        <Image
          src={imgSrc}
          alt={name}
          width={194}
          height={194}
          className="object-contain rounded-xl"
          onError={() => setImgSrc("/sample.svg")}
        />
      </div>

      <div className="">
        <h3 className="text-base font-semibold text-gray-900">{name}</h3>

        <p className="text-sm text-gray-500 mt-1">{location}</p>

        <span className="inline-block mt-3 text-xs px-3 py-1 rounded-full bg-red-50 text-red-500">
          {category}
        </span>

        <button className="block mt-4 text-sm font-medium text-red-500">
          Explore
        </button>
      </div>
    </div>
  );
}
