"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import GlobalEmission from "@/components/global-emission";
import DashboardEmission from "@/components/dashboard-emission-stats";
import { EmissionLogsChart } from "@/components/emissions-logs-chart";

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
      <div className="mt-8 flex flex-col gap-4">
        <EmissionLogsChart />
        <div className="flex flex-col gap-4"></div>
      </div>
    </div>
  );
}

export default Dashboard;
