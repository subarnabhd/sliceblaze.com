"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getBusinessByUsername, getBusinessWifi } from "@/lib/supabase";
import WifiConnect from "@/components/WifiConnect";

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
  // Removed unused brand_primary_color state
  interface Business {
    id: number;
    username: string;
    name: string;
    brand_primary_color?: string;
  }
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWifi() {
      if (username) {
        const business = await getBusinessByUsername(username);
        if (business) {
          setBusiness(business);

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

      {/* WiFi Networks */}
      {wifiNetworks && wifiNetworks.length > 0 && business && (
        <div className="mt-4 md:mt-6">
          <WifiConnect
            wifiNetworks={wifiNetworks}
            brandColor={business.brand_primary_color || "#ED1D33"}
          />
        </div>
      )}
    </main>
  );
};

export default WifiPage;
