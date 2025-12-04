"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/contexts/AuthContext";
import { BADGES } from "@/lib/constants";
import Badge from "./ui/badge";
import Link from "next/link";
import { ArrowRightIcon, LogOut } from "lucide-react";
import { Button } from "./ui/button";
export function ProfileAvatar() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar>
          <AvatarImage src={user.photoURL || ""} />
          <AvatarFallback>{user.displayName?.charAt(0)}</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-64 rounded-3xl shadow-none border border-foreground/20 mr-2">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="leading-none font-medium">Badges</h4>
            <p className="text-muted-foreground text-sm">
              Complete quests to earn badges.
            </p>
            <div className="flex flex-col">
              {BADGES.map((badge) => (
                <Badge key={badge.id} badge={badge}>
                  <div className="flex gap-1 my-1">
                    <Badge.Image className="w-10 h-10 rounded-lg" />
                    <div className="flex flex-col">
                      <Badge.Name className="text-sm" />
                      <Badge.HbarPrice className="text-xs text-muted-foreground" />
                    </div>
                  </div>
                </Badge>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs flex flex-col">
                Logged in as {user.displayName}{" "}
                <span className="text-primary text-xs">
                  ({user.email?.slice(0, 4)}...
                  {user.email?.slice(-12)})
                </span>
              </p>
              <Button variant="outline" size="icon">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
            <Link
              href="/profile"
              className="w-full items-center text-center justify-center flex gap-2 group"
            >
              <span className="text-sm font-semibold text-muted-foreground group-hover:text-primary transition-all duration-300">
                View Profile
              </span>
              <ArrowRightIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ProfileAvatar;
