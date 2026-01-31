import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AdminSidebar({ active }: { active?: string }) {
  return (
    <div className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
            <Image
                src="/sliceblaze-logo-icon.svg"
                alt="SliceBlaze logo"
                width={80}
                height={40}
                priority
                className="m-auto mb-2"
              />
        <h2 className="text-2xl font-bold text-[#ED1D33] m-auto text-center">Hello Admin</h2>
      </div>
      <nav className="mt-6 px-4 space-y-2">
        <Link
          href="/admin/overview"
          className={`flex text-[14px] items-center gap-3 px-4 py-3 rounded-lg ${active === "overview" ? "bg-[#ED1D33] text-white" : "text-gray-700 hover:bg-gray-100"} transition`}
        >
          <span className="text-lg">📊</span>
          <span>Overview</span>
        </Link>
        <Link
          href="/admin/business-management"
          className={`flex text-[14px] items-center gap-3 px-4 py-3 rounded-lg ${active === "business-management" ? "bg-[#ED1D33] text-white" : "text-gray-700 hover:bg-gray-100"} transition`}
        >
          <span className="text-lg">🏢</span>
          <span>Business Management</span>
        </Link>
        <Link
          href="/admin/user-management"
          className={`flex text-[14px] items-center gap-3 px-4 py-3 rounded-lg ${active === "user-management" ? "bg-[#ED1D33] text-white" : "text-gray-700 hover:bg-gray-100"} transition`}
        >
          <span className="text-lg">👥</span>
          <span>User Management</span>
        </Link>
        <Link
          href="/admin/menu"
          className={`flex text-[14px] items-center gap-3 px-4 py-3 rounded-lg ${active === "menu" ? "bg-[#ED1D33] text-white" : "text-gray-700 hover:bg-gray-100"} transition`}
        >
          <span className="text-lg">🍕</span>
          <span>Menu Management</span>
        </Link>
        <Link
          href="/admin/wifi"
          className={`flex text-[14px] items-center gap-3 px-4 py-3 rounded-lg ${active === "wifi" ? "bg-[#ED1D33] text-white" : "text-gray-700 hover:bg-gray-100"} transition`}
        >
          <span className="text-lg">📶</span>
          <span className="">WiFi Management</span>
        </Link>
      </nav>
    </div>
  );
}
