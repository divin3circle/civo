import { db } from "@/config/firebase.config";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { EmissionLog } from "@/lib/constants";
import { mockEmissionLogs } from "@/lib/mock";

async function getEmissionLogs(
  userId: string | undefined,
  daysLimit: number = 30
): Promise<EmissionLog[]> {
  if (!userId) {
    return [];
  }

  try {
    // const logsRef = collection(db, "users", userId, "emissionLogs");
    // const q = query(logsRef, orderBy("date", "desc"), limit(daysLimit));

    // const querySnapshot = await getDocs(q);
    // const logs: EmissionLog[] = [];

    // querySnapshot.forEach((doc) => {
    //   const data = doc.data();
    //   logs.push({
    //     id: doc.id,
    //     date: data.date,
    //     transport: data.transport || {
    //       mode: "",
    //       distance: 0,
    //       co2e: 0,
    //       price: 0,
    //     },
    //     food: data.food || { meals: [], price: 0, co2e: 0 },
    //     energy: data.energy || { units: 0, price: 0, co2e: 0 },
    //     totalEmission: data.totalEmission || 0,
    //     totalSpending: data.totalSpending || 0,
    //     aiAdvice: data.aiAdvice || "",
    //     aiScore: data.aiScore || 0,
    //   } as EmissionLog);
    // });

    return mockEmissionLogs.reverse();
  } catch (error) {
    console.error("Error fetching emission logs:", (error as Error).message);
    return [];
  }
}

export function useEmissionLogs(daysLimit: number = 30) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["emissionLogs", user?.uid, daysLimit],
    queryFn: () => getEmissionLogs(user?.uid, daysLimit),
    enabled: !!user?.uid,
  });
}

export function transformLogsForChart(logs: EmissionLog[]) {
  return logs.map((log) => {
    const date = new Date(log.date);
    const dayLabel = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return {
      date: log.date,
      day: dayLabel,
      transport: Number(log.transport.co2e.toFixed(2)),
      food: Number(log.food.co2e.toFixed(2)),
      energy: Number(log.energy.co2e.toFixed(2)),
      total: Number(log.totalEmission.toFixed(2)),
    };
  });
}
