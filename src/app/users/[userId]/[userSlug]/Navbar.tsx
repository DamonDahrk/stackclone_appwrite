"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAuthStore } from "@/store/Auth";

const Navbar = () => {
  const { userId, userSlug } = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const items = [
    { name: "Summary", href: `/users/${userId}/${userSlug}` },
    { name: "Questions", href: `/users/${userId}/${userSlug}/questions` },
    { name: "Answers", href: `/users/${userId}/${userSlug}/answers` },
    { name: "Votes", href: `/users/${userId}/${userSlug}/votes` },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/"); // redirect to home
  };

  return (
    <ul className="flex w-full shrink-0 gap-1 overflow-auto sm:w-40 sm:flex-col">
      {items.map((item) => (
        <li key={item.name}>
          <Link
            href={item.href}
            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
              pathname === item.href ? "bg-white/20" : "hover:bg-white/20"
            }`}
          >
            {item.name}
          </Link>
        </li>
      ))}
      <li>
        <button
          onClick={handleLogout}
          className="block w-full rounded-full px-3 py-0.5 duration-200 hover:bg-white/20 text-left"
        >
          Logout
        </button>
      </li>
    </ul>
  );
};

export default Navbar;
