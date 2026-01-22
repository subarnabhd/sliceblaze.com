"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBusinessById, updateBusiness } from "@/lib/supabase";

interface SessionData {
  userId: number;
  businessId: number;
  username: string;
  email: string;
  role: string;
  fullName: string;
}

interface BusinessData {
  id: number
  name?: string
  location?: string
  category?: string
  contact?: string
  openingHours?: string
  direction?: string
  facebook?: string
  instagram?: string
  tiktok?: string
  googleMapUrl?: string
  menuUrl?: string
  brandPrimaryColor?: string
  brandSecondaryColor?: string
  description?: string
  image?: string
  username?: string
  wifiQrCode?: string
}

export default function OwnerDashboard() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState<BusinessData>({} as BusinessData);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const sessionData = localStorage.getItem("session");
    if (!sessionData) {
      router.push("/sliceblaze/login");
      return;
    }

    const parsedSession = JSON.parse(sessionData);
    
    // Check if user is an owner
    if (parsedSession.role !== 'owner') {
      router.push('/business');
      return;
    }
    
    setSession(parsedSession);

    // Fetch business details
    const fetchBusiness = async () => {
      const businessData = await getBusinessById(parsedSession.businessId);
      if (businessData) {
        setBusiness(businessData);
        setFormData(businessData);
      }
      setLoading(false);
    };

    fetchBusiness();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: BusinessData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const updated = await updateBusiness(formData.id, formData);
      if (updated) {
        setBusiness(updated);
        setMessage("✅ Business details updated successfully!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Failed to update business details");
      }
    } catch (error) {
      setMessage("❌ An error occurred while saving");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("session");
    router.push("/sliceblaze/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-red-600">Business not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {business.name}
            </h1>
            <p className="text-gray-600">Welcome, {session?.username}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Success/Error Message */}
        {message && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Edit Business Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Business Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            {/* Contact */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Contact Number
              </label>
              <input
                type="text"
                name="contact"
                value={formData.contact || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            {/* Opening Hours */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Opening Hours
              </label>
              <input
                type="text"
                name="openingHours"
                value={formData.openingHours || ""}
                onChange={handleInputChange}
                placeholder="e.g., 9 AM - 6 PM"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            {/* Direction */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Direction/Address
              </label>
              <input
                type="text"
                name="direction"
                value={formData.direction || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            {/* TikTok */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                TikTok URL
              </label>
              <input
                type="url"
                name="tiktok"
                value={formData.tiktok || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            {/* Google Maps URL */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Google Maps URL
              </label>
              <input
                type="url"
                name="googleMapUrl"
                value={formData.googleMapUrl || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            {/* Menu URL */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Menu URL
              </label>
              <input
                type="url"
                name="menuUrl"
                value={formData.menuUrl || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>

            {/* Brand Primary Color */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Brand Primary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  name="brandPrimaryColor"
                  value={formData.brandPrimaryColor || "#000000"}
                  onChange={handleInputChange}
                  className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  name="brandPrimaryColor"
                  value={formData.brandPrimaryColor || ""}
                  onChange={handleInputChange}
                  placeholder="#000000"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
            </div>

            {/* Brand Secondary Color */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Brand Secondary Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  name="brandSecondaryColor"
                  value={formData.brandSecondaryColor || "#000000"}
                  onChange={handleInputChange}
                  className="w-16 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <input
                  type="text"
                  name="brandSecondaryColor"
                  value={formData.brandSecondaryColor || ""}
                  onChange={handleInputChange}
                  placeholder="#000000"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Description (Full Width) */}
          <div className="mt-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Business Description
            </label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              placeholder="Describe your business..."
            />
          </div>

          {/* Save Button */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setFormData(business)}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
