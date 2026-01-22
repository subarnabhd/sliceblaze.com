import { businesses } from "@/data/businesses";
import Image from "next/image";


interface BusinessPageProps {
  params: { username: string };
}

// For SSG: pre-generate pages for all businesses
export function generateStaticParams() {
  return businesses.map((b) => ({
    username: b.username, // usernames are lowercase
  }));
}

export default function BusinessProfile({ params }: BusinessPageProps) {
  const { username } = params;

  // Direct match since username is always lowercase
  const business = businesses.find((b) => b.username === username);

  if (!business) {
    return (
      <div className="p-10 text-center text-red-500 text-xl">
        Business not found
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white rounded-xl shadow-md mt-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Business Image */}
        <div className="">
          <Image
            src={business.image || "/sample.svg"} // default image
            alt={business.name || "Business Image"}
            width={250}
            height={250}
            className="rounded-xl object-contain"
          />
        </div>

        {/* Business Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            {business.name || "Unnamed Business"}
          </h1>

          <p className="text-gray-500 mt-2">
            {business.location || "Location not available"}
          </p>

          <span className="inline-block mt-3 text-sm px-3 py-1 rounded-full bg-red-50 text-red-500">
            {business.category || "Category not available"}
          </span>

          <p className="mt-6 text-gray-700">
            {business.description || "No description available."}
          </p>

          <div className="mt-4 space-y-2 text-gray-800">
            <p>
              <strong>Contact:</strong> {business.contact || "Not provided"}
            </p>
            <p>
              <strong>Opening Hours:</strong>{" "}
              {business.openingHours || "Not provided"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
