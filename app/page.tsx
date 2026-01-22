import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ED1D33] font-sans text-white">
      
   

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

      {/* Explore Business button */}
      <a
        href="/business"
        className="mt-6 rounded-full border border-white px-6 py-2 text-white hover:bg-white hover:text-[#ED1D33] transition-colors"
      >
        Explore Business →
      </a>

      {/* Website link */}
      {/* <a
        href="https://sliceblaze.com"
        className="mt-8 text-white underline"
      >
        www.sliceblaze.com
      </a> */}
    </div>
  );
}
