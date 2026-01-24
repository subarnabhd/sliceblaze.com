import React from "react";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedinIcon,
  TiktokIcon,
  TwitterIcon,
  YoutubeIcon,
} from "@/icons/SocialIcons";

const Socialmedia = () => {
  return (
    <div
      aria-label="Social media links"
      className="flex gap-3"
      role="navigation"
    >
      <Link
        href="https://www.facebook.com/letsvhandar"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Vhandar Facebook page"
        title="Visit Vhandar on Facebook"
        className="w-[42px] h-[42px] p-3 text-lg color-neutral-1 rounded-full bg-gray-400 hover:bg-gray-500 flex items-center justify-center"
      >
        <FacebookIcon />
        <span className="sr-only">Facebook</span>
      </Link>

      <Link
        href="https://www.instagram.com/letsvhandar"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Vhandar Instagram profile"
        title="Visit Vhandar on Instagram"
        className="w-[42px] h-[42px] p-3 text-lg color-neutral-1 rounded-full bg-gray-400 hover:bg-gray-500 flex items-center justify-center"
      >
        <InstagramIcon />
        <span className="sr-only">Instagram</span>
      </Link>

      <Link
        href="https://www.x.com/@letsvhandar"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Vhandar Twitter profile"
        title="Visit Vhandar on Twitter"
        className="w-[42px] h-[42px] p-3 text-lg color-neutral-1 rounded-full bg-gray-400 hover:bg-gray-500 flex items-center justify-center"
      >
        <TwitterIcon />
        <span className="sr-only">Twitter</span>
      </Link>

      <Link
        href="https://www.tiktok.com/@letsvhandar"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Vhandar TikTok profile"
        title="Visit Vhandar on TikTok"
        className="w-[42px] h-[42px] p-3 text-lg color-neutral-1 rounded-full bg-gray-400 hover:bg-gray-500 flex items-center justify-center"
      >
        <TiktokIcon />
        <span className="sr-only">TikTok</span>
      </Link>

      <Link
        href="https://www.youtube.com/@letsvhandar"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Vhandar YouTube channel"
        title="Visit Vhandar on YouTube"
        className="w-[42px] h-[42px] p-3 text-lg color-neutral-1 rounded-full bg-gray-400 hover:bg-gray-500 flex items-center justify-center"
      >
        <YoutubeIcon />
        <span className="sr-only">YouTube</span>
      </Link>

      <Link
        href="https://linkedin.com/company/letsvhandar"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Vhandar LinkedIn profile"
        title="Visit Vhandar on LinkedIn"
        className="w-[42px] h-[42px] p-3 text-lg color-neutral-1 rounded-full bg-gray-400 hover:bg-gray-500 flex items-center justify-center"
      >
        <LinkedinIcon />
        <span className="sr-only">LinkedIn</span>
      </Link>
    </div>
  );
};

export default Socialmedia;
