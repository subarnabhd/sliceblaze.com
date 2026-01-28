import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Socialmedia from './Socialmedia';

const Footer = () => {
  return (
    <div>
      <div className="h-75 border-t border-gray-200 flex flex-col gap-5 items-center justify-center p-6 bg-white">
        <Link
          href="/"
          aria-label="Go to home"
          className="flex items-center justify-center shrink-0"
        >
          <Image
            src="/sliceblazelogo.svg"
            alt="SliceBlaze logo"
            width={150}
            height={30}
            priority
            className="cursor-pointer"
          />
        </Link>
        <p className=" text-sm text-gray-600">Your Business Digital Partner</p>
        <Socialmedia />
      </div>
      <div className="py-5 border-t border-gray-200 flex  bottom-0 w-full bg-white z-40">
        <p className="m-auto text-sm">
          Copyright © 2025 Sliceblaze. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Footer