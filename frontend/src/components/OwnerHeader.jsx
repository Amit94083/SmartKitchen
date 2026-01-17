import React from "react";
import { useAuth } from "../context/AuthContext";

export default function OwnerHeader({ restaurant }) {
  const { user, logout } = useAuth();
  return (
    <header className="w-full flex items-center justify-between px-10 py-3 bg-white shadow-md fixed top-0 left-0 z-30 h-[80px]">
      <div className="flex flex-col gap-1">
        <span className="text-xl font-semibold text-gray-900">{restaurant?.name || "Restaurant"}</span>
        <span className="text-sm text-gray-600">{restaurant?.address || "Address not specified"}</span>
        <span className="text-sm text-gray-600">{restaurant?.phone || "Phone not specified"}</span>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="font-medium text-gray-800">Owner: {user?.name}</span>
        <span className="text-sm text-gray-600">{user?.email}</span>
        <button className="text-xs text-red-500 hover:underline" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
