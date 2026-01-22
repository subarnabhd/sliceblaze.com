// app/business/[username]/page.tsx
import Image from "next/image";
import { businesses } from "@/data/businesses"; // adjust path to your file

interface BusinessPageProps {
  params: { username: string };
}

export default function BusinessPage({ params }: BusinessPageProps) {
  const { username } = params;

  // Find the business by username
  const business = businesses.find((b) => b.username === username);

  if (!business) {
    return (
      <div className="p-10 text-center text-red-500">
        Business not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white rounded-xl shadow-md mt-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Business Image */}
        <div className="flex-shrink-0">
          <Image
            src={business.image || "/sample.svg"}
            alt={business.name}
            width={250}
            height={250}
            className="rounded-xl object-contain"
          />
        </div>

        {/* Business Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{business.name}</h1>
          <p className="text-gray-500 mt-2">{business.location}</p>

          <span className="inline-block mt-3 text-sm px-3 py-1 rounded-full bg-red-50 text-red-500">
            {business.category}
          </span>

          <p className="mt-6 text-gray-700">{business.description}</p>

          <div className="mt-4 space-y-2">
            <p><strong>Contact:</strong> {business.contact}</p>
            <p><strong>Opening Hours:</strong> {business.openingHours}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
