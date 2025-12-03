"use client";
import { BadgeType } from "@/lib/constants";
import React, { createContext, useContext } from "react";
import Image from "next/image";
import { useCheckBadge } from "@/hooks/use-badge";

interface BadgeContextType {
  badge: BadgeType;
}

interface BadgeProviderProps {
  children: React.ReactNode;
  badge: BadgeType;
}

const BadgeContext = createContext<BadgeContextType | undefined>(undefined);

export const useBadge = () => {
  const context = useContext(BadgeContext);
  if (!context) {
    throw new Error("useBadge must be used within a BadgeProvider");
  }
  return context;
};

function Badge({ children, badge }: BadgeProviderProps) {
  return (
    <BadgeContext.Provider value={{ badge }}>
      <div className="">{children}</div>
    </BadgeContext.Provider>
  );
}

Badge.Image = function BadgeImage({ className }: { className?: string }) {
  const { badge } = useBadge();
  const { data: isBadgeEarned = false } = useCheckBadge(badge.id);
  return (
    <Image
      src={badge.image}
      alt={badge.name}
      width={100}
      height={100}
      style={{
        filter: isBadgeEarned ? "none" : "grayscale(100%)",
        opacity: isBadgeEarned ? 1 : 0.5,
        transition: "all 0.3s ease",
      }}
      className={className}
    />
  );
};

Badge.Name = function BadgeName({ className }: { className?: string }) {
  const { badge } = useBadge();

  return <h1 className={className}>{badge.name}</h1>;
};

Badge.Description = function BadgeDescription({
  className,
}: {
  className?: string;
}) {
  const { badge } = useBadge();
  return <p className={className}>{badge.description}</p>;
};

Badge.Rarity = function BadgeRarity({ className }: { className?: string }) {
  const { badge } = useBadge();
  return <p className={className}>{badge.rarity}</p>;
};

Badge.HbarPrice = function BadgeHbarPrice({
  className,
}: {
  className?: string;
}) {
  const { badge } = useBadge();
  return (
    <p className={className}>ℏ{Number(badge.hbarPrice).toLocaleString()}</p>
  );
};

Badge.NftTokenId = function BadgeNftTokenId({
  className,
}: {
  className?: string;
}) {
  const { badge } = useBadge();
  return <p className={className}>{badge.nftTokenId}</p>;
};

export default Badge;
