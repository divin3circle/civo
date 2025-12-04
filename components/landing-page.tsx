"use client";
import { motion } from "motion/react";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl font-sans font-semibold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        Log rides & meals, watch your CO₂ drop, receive Intelligent AI coaching,
        and
        <Highlight className="text-black dark:text-white">
          mint immortal Green Badges on Hedera.
        </Highlight>
      </motion.h1>
      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="flex mx-2 gap-4 mt-12 w-full items-center justify-between flex-col md:flex-row md:justify-center"
      >
        <Button
          variant="default"
          size="lg"
          className="w-full md:w-1/4 rounded-3xl flex items-center justify-center"
          onClick={() => router.push("/login")}
        >
          Get Started
          <Image
            src="/footprint.jpg"
            alt="Footprint"
            width={20}
            height={20}
            className="w-6 h-6 rounded-full"
          />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full md:w-auto rounded-3xl gap-2 flex items-center justify-center"
          onClick={() =>
            window.open("https://github.com/divin3circle/civo", "_blank")
          }
        >
          Learn More
          <ChevronRightIcon className="w-6 h-6" />
        </Button>
      </motion.div>
    </HeroHighlight>
  );
}
