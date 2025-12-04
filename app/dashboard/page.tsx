"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import GlobalEmission from "@/components/global-emission";
import DashboardEmission from "@/components/dashboard-emission-stats";
import { EmissionLogsChart } from "@/components/emissions-logs-chart";
import { azureAiEmissionCoach } from "@/assets";
import Image from "next/image";
import { mockEmissionLogs } from "@/lib/mock";
import Link from "next/link";
import { ArrowRightIcon, CirclePlusIcon, StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "date-fns";

const MAX_STARS = 5;
const RenderScoreStars = ({ score }: { score: number }) => {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: MAX_STARS }, (_, index) => (
        <StarIcon
          key={index}
          className={cn(
            "w-4 h-4",
            index < score ? "text-green-500" : "text-gray-300"
          )}
        />
      ))}
    </div>
  );
};

function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto px-2">
      <Navbar />
      <div className="mt-4 flex flex-col w-full md:flex-row gap-4">
        <GlobalEmission />
        <DashboardEmission />
      </div>
      <div className="mt-8 flex flex-col gap-4 md:flex-row">
        <EmissionLogsChart />
        <div className="w-full md:w-1/3 border border-foreground/20 rounded-3xl p-4 mb-4 md:mb-0">
          <h2 className="text-lg font-bold">Azure AI Emission Coach</h2>
          <p className="text-xs text-muted-foreground">
            Get personalized calculations and advice on how to reduce your
            emissions.
          </p>
          <Image
            src={azureAiEmissionCoach}
            alt="Azure AI Emission Coach"
            width={500}
            height={500}
            className="w-full mt-4 object-cover rounded-3xl"
          />
          <div className="mt-4">
            <h2 className="text-lg font-medium">Recent Emissions</h2>
            <p className="text-sm font-sans leading-relaxed text-muted-foreground">
              {mockEmissionLogs[mockEmissionLogs.length - 1].aiAdvice}
            </p>
            <div className="mt-4 flex items-center gap-2 justify-between">
              <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                {mockEmissionLogs[mockEmissionLogs.length - 1].aiScore}/5
                <RenderScoreStars
                  score={mockEmissionLogs[mockEmissionLogs.length - 1].aiScore}
                />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {formatDate(
                  new Date(mockEmissionLogs[mockEmissionLogs.length - 1].date),
                  "MMM d, yyyy"
                )}
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between gap-2">
              <Link
                href="/log"
                className="text-sm rounded-3xl border border-foreground/20 gap-1 p-2 w-1/2 items-center justify-center flex group hover:bg-foreground/10 transition-all duration-300"
              >
                Start Tracking
                <CirclePlusIcon className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
              <Link
                href="/dashboard/coach"
                className="text-sm rounded-3xl bg-foreground p-2 w-1/2 items-center justify-center flex text-background group hover:bg-foreground/90 transition-all duration-300"
              >
                View All
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-all duration-300" />
              </Link>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            AI Generated Advice and Data might not be 100% accurate. Should be
            used as a guide only.
            <Link
              href="/dashboard/coach"
              className="text-blue-500 underline ml-1"
            >
              Learn more
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
