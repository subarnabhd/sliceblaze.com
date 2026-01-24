import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Socialmedia from './Socialmedia';

const Footer = () => {
  return (
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
      <p className=' text-sm text-gray-600'>Your Business Digital Partner</p>
      <Socialmedia />
    </div>
  );
}

export default Footer