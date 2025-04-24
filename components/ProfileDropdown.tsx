// filepath: d:\PrepMate\prep-mate\PrepMate\components\ProfileDropdown.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    // Call your logout API
    await fetch("/api/logout", { method: "POST" });
    router.push("/sign-in");
  };

  return (
    <div className="relative">
      {/* Hamburger Icon */}
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-full hover:bg-gray-200"
        aria-label="Profile Menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 5.25h16.5M3.75 12h16.5M3.75 18.75h16.5"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
          <ul className="py-2">
            <li
              onClick={() => router.push("/profile")}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
            >
              View Profile
            </li>
            <li
              onClick={handleLogout}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500"
            >
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;