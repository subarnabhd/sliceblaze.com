import { businesses } from "@/data/businesses";
import Image from "next/image";


interface BusinessPageProps {
  params: Promise<{ username: string }>;
}

// For SSG: pre-generate pages for all businesses
export function generateStaticParams() {
  return businesses.map((b) => ({
    username: b.username, // usernames are lowercase
  }));
}

export default async function BusinessProfile({ params }: BusinessPageProps) {
  const { username } = await params;

  // Convert to lowercase for matching
  const business = businesses.find((b) => b.username === username.toLowerCase());

  if (!business) {
    return (
      <div className="p-10 text-center text-red-500 text-xl">
        Business not found
      </div>
    );
  }

  return (
    <div className="bg-gray-200 min-h-screen">
      {/* Top Cover with Brand Color */}
      <div
        className="py-32"
        style={{
          background: `linear-gradient(135deg, ${business.brandPrimaryColor || "#ffffff"} 0%, ${business.brandSecondaryColor || "#ffffff"} 100%)`,
        }}
      />

      {/* White Content Card */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <div className="bg-white rounded-xl shadow-lg p-10 -mt-50 relative z-10">
          {/* Profile Picture in White Box */}
          <div className="flex justify-center mb-8">
            <Image
              src={business.image || "/sample.svg"}
              alt={business.name || "Business Image"}
              width={200}
              height={200}
              className="rounded-full object-contain border-1"
              style={{ borderColor: business.brandPrimaryColor || "#000" }}
              priority
            />
          </div>

          {/* Business Details */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">
              {business.name || "Unnamed Business"}
            </h1>

            <p className="text-gray-500 mt-4 text-lg">
              {business.location || "Location not available"}
            </p>

            <span
              className="inline-block mt-4 text-sm px-4 py-2 rounded-full text-white font-semibold"
              style={{ backgroundColor: business.brandPrimaryColor || "#000" }}
            >
              {business.category || "Category not available"}
            </span>

            <p className="mt-8 text-gray-700 text-center max-w-2xl mx-auto">
              {business.description || "No description available."}
            </p>

            <div className="mt-8 space-y-3 text-gray-800 text-center">
              <p>
                <strong>Contact:</strong> {business.contact || "Not provided"}
              </p>
              <p>
                <strong>Opening Hours:</strong>{" "}
                {business.openingHours || "Not provided"}
              </p>
            </div>

            {/* Social Media Links */}
            <div className="mt-8 flex gap-4 justify-center">
              {business.facebook && (
                <a
                  href={business.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Facebook
                </a>
              )}
              {business.instagram && (
                <a
                  href={business.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:underline font-semibold"
                >
                  Instagram
                </a>
              )}
              {business.tiktok && (
                <a
                  href={business.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline font-semibold"
                >
                  TikTok
                </a>
              )}
            </div>

            {/* Direction & Map */}
            {business.direction && (
              <div className="mt-8">
                <p className="mb-3 text-gray-800">
                  <strong>Direction:</strong> {business.direction}
                </p>
                {business.googleMapUrl && (
                  <a
                    href={business.googleMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-white px-6 py-3 rounded font-semibold hover:opacity-90"
                    style={{ backgroundColor: business.brandPrimaryColor || "#000" }}
                  >
                    📍 View on Google Maps
                  </a>
                )}
              </div>
            )}

            {/* Menu Button */}
            {business.menuUrl && (
              <div className="mt-6">
                <a
                  href={business.menuUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-white px-6 py-3 rounded font-semibold hover:opacity-90 ml-3"
                  style={{ backgroundColor: business.brandSecondaryColor || "#666" }}
                >
                  📋 View Menu
                </a>
              </div>
            )}

            {/* WiFi QR Code */}
            {business.wifiQrCode && (
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-3">Connect to WiFi</h3>
                <div className="flex justify-center">
                  <Image
                    src={business.wifiQrCode}
                    alt="WiFi QR Code"
                    width={150}
                    height={150}
                    className="border-4 rounded"
                    style={{ borderColor: business.brandPrimaryColor || "#000" }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
