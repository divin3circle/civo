"use client";

import Image from "next/image";
import { transparentLogo } from "@/assets";
import { NAV_LINKS } from "@/lib/constants";
import ProfileAvatar from "./user-profile-avatar";
import NavItem from "./ui/nav-item";

export function Navbar() {
  return (
    <div className="flex justify-between items-center p-4">
      <div className="flex items-center">
        <Image
          src={transparentLogo}
          alt="logo"
          width={32}
          height={32}
          className="w-10 h-10"
        />
        <h1 className="text-xl font-semibold font-sans">civo</h1>
      </div>
      <div className="hidden md:flex items-center gap-4">
        {NAV_LINKS.map((navLink) => (
          <NavItem key={navLink.href} navLink={navLink} />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <ProfileAvatar />
      </div>
    </div>
  );
}
