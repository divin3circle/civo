"use client";

import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme, mounted } = useTheme();

  if (!mounted) {
    return null;
  }

  const getIcon = () => {
    if (resolvedTheme === "dark") {
      return <Moon className="h-5 w-5" />;
    }
    if (resolvedTheme === "light") {
      return <Sun className="h-5 w-5" />;
    }
    return <Monitor className="h-5 w-5" />;
  };

  const themeOptions = [
    {
      value: "light" as const,
      label: "Light",
      icon: Sun,
    },
    {
      value: "dark" as const,
      label: "Dark",
      icon: Moon,
    },
    {
      value: "system" as const,
      label: "System",
      icon: Monitor,
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg border-foreground/20 bg-background/80 backdrop-blur-sm hover:bg-background/90"
            aria-label="Toggle theme"
          >
            {getIcon()}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          side="top"
          className="w-48 p-2 rounded-3xl"
          sideOffset={12}
        >
          <div className="flex flex-col gap-1">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const isActive = theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={cn(
                    "flex items-center gap-3 rounded-3xl px-3 py-2 text-sm font-medium transition-colors",
                    "hover:bg-accent hover:text-accent-foreground",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
