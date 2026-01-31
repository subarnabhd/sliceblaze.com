"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBusinessByUsername, getBusinessWifi } from "@/lib/supabase";

interface WifiNetwork {
  id: number;
  ssid: string;
  password: string;
  security_type: string;
  is_hidden: boolean;
}

const WifiPage = () => {
  const params = useParams();
  const username = params.username as string;
  const [wifiNetworks, setWifiNetworks] = useState<WifiNetwork[]>([]);
  const [brandColor, setBrandColor] = useState<string>("#ED1D33");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWifi() {
      if (username) {
        const business = await getBusinessByUsername(username);
        if (business) {
          setBrandColor(business.brand_primary_color || "#ED1D33");
          const wifi = await getBusinessWifi(business.id);
          setWifiNetworks(wifi);
        }
        setLoading(false);
      }
    }
    fetchWifi();
  }, [username]);

  if (loading) {
    return (
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">WiFi</h1>
        <div className="text-gray-600">Loading WiFi information...</div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">WiFi</h1>
      {wifiNetworks && wifiNetworks.length > 0 ? (
        <div className="space-y-6">
          {wifiNetworks.map((wifi) => (
            <div key={wifi.id} className="bg-white rounded-xl shadow p-4 border border-gray-200">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.53 16.11a3.001 3.001 0 016.94 0M5.07 12.66a8.003 8.003 0 0113.86 0M1.64 9.21a13.003 13.003 0 0120.72 0" />
                  </svg>
                  <span className="font-bold text-lg">{wifi.ssid}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Password:</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-gray-800 font-mono">{wifi.password || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Security:</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-gray-800">{wifi.security_type}</span>
                </div>
                {wifi.is_hidden && (
                  <span className="text-xs text-yellow-600">Hidden Network</span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600">No WiFi information available for this restaurant.</div>
      )}
    </main>
  );
};

export default WifiPage;
