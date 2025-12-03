"use client";
import { useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/config/firebase.config";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-sm text-gray-500">Welcome to the dashboard</p>
      <p className="text-sm text-gray-500">User: {user?.email}</p>
      <Button onClick={() => signOut(auth)}>Logout</Button>
    </div>
  );
}

export default Dashboard;
