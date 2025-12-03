import { db } from "@/config/firebase.config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export interface UserData {
  badge100Kg: boolean;
  badge30Day: boolean;
  badgeHero: boolean;

  name: string;
  email: string;
  photoUrl: string;
  homeLocation: string;
  dietType: string;
  currency: string;

  walletAddress: string;

  totalCO2Saved: string;
  streak: string;
  longestStreak: string;
  lastLoggedDate: string;

  onboarded: boolean;
  createdAt: string;
}

export async function saveNewUser(userId: string, userData: UserData) {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      console.log(
        `User with ID ${userId} already registered. Data:`,
        userDocSnap.data()
      );
      throw new Error("User already registered");
    } else {
      await setDoc(userDocRef, userData);
      console.log(`User ${userId} successfully registered!`);
    }
  } catch (error) {
    console.error((error as Error).message);
    toast.error("Failed to signup " + (error as Error).message);
    throw new Error("Failed to signup + " + (error as Error).message);
  }
}

export async function getOrCreateUser(
  userId: string,
  defaultUserData: Partial<UserData>
): Promise<UserData | null> {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data() as UserData;
    } else {
      const newUserData: UserData = {
        badge100Kg: false,
        badge30Day: false,
        badgeHero: false,
        name: defaultUserData.name || "",
        email: defaultUserData.email || "",
        photoUrl: defaultUserData.photoUrl || "",
        homeLocation: defaultUserData.homeLocation || "",
        dietType: defaultUserData.dietType || "",
        currency: defaultUserData.currency || "KES",
        walletAddress: defaultUserData.walletAddress || "",
        totalCO2Saved: defaultUserData.totalCO2Saved || "0",
        streak: defaultUserData.streak || "0",
        longestStreak: defaultUserData.longestStreak || "0",
        lastLoggedDate: defaultUserData.lastLoggedDate || "",
        onboarded: defaultUserData.onboarded ?? false,
        createdAt: defaultUserData.createdAt || new Date().toISOString(),
      };

      await setDoc(userDocRef, newUserData);
      console.log(`New user ${userId} created via OAuth login`);
      return newUserData;
    }
  } catch (error) {
    console.error("Error getting or creating user:", (error as Error).message);
    toast.error("Failed to get or create user data");
    return null;
  }
}

export function generateUserId() {
  return uuidv4();
}

export function isValidUsername(username: string) {
  return (
    /^[a-zA-Z0-9]+$/.test(username) &&
    username.length >= 3 &&
    username.length <= 20
  );
}
