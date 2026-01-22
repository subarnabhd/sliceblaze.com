import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full sticky top-0  h-25 flex items-center justify-center border-b border-gray-200 bg-white-900 bg-blur-5 backdrop-blur-md z-50">
      <Link
        href="/"
        aria-label="Go to home"
        className="flex items-center justify-center"
      >
        <Image
          src="/sliceblazelogo.svg"
          alt="SliceBlaze logo"
          width={120}
          height={90}
          priority
          className="cursor-pointer"
        />
      </Link>
    </header>
  );
}
