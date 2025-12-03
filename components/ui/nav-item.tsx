"use client";
import { NavLinkType } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItem({ navLink }: { navLink: NavLinkType }) {
  const pathname = usePathname();
  return (
    <Link
      href={navLink.href}
      className={cn(
        "flex text-sm items-center gap-2 group",
        pathname === navLink.href ? "border-b-2 border-primary" : ""
      )}
    >
      <span
        className={cn(
          pathname === navLink.href
            ? "text-primary font-semibold"
            : "text-muted-foreground group-hover:text-primary transition-all duration-300"
        )}
      >
        {navLink.label}
      </span>
    </Link>
  );
}

export default NavItem;
