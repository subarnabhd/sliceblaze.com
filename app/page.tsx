import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col m-auto min-h-screen items-center justify-center  font-sans bg-[#ED1D33]">
      
        <Image
          className=""
          src="/sliceblazelogo_white.svg"
          alt="sliceblaze logo"
          width={300}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-[14px] font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Your Business Digital Partner
          </h1>
         
            {/* <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
           
            Explore Business
          </a>
          <a
              href="https://sliceblaze.com"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              www.sliceblaze.com
            </a> */}
        </div>
     
      
    </div>
  );
}
