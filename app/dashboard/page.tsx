"use client";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import GlobalEmission from "@/components/global-emission";
import DashboardEmission from "@/components/dashboard-emission-stats";

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
      <div className="mt-4 flex flex-col w-full md:flex-row">
        <GlobalEmission />
        <DashboardEmission />
      </div>
    </div>
  );
}

export default Dashboard;
