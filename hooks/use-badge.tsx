import { useQuery } from "@tanstack/react-query";
import { useGetUser, UserData } from "./use-user";

function checkBadge(userData: UserData | undefined, badge: string): boolean {
  if (!userData) {
    return false;
  }
  switch (badge) {
    case "badge100Kg":
      return userData.badge100Kg;
    case "badge30Day":
      return userData.badge30Day;
    case "badgeHero":
      return userData.badgeHero;
    default:
      return false;
  }
}

export const useCheckBadge = (badge: string) => {
  const { data: userData, isLoading: isLoadingUser } = useGetUser();

  return useQuery({
    queryKey: ["badge", badge, userData?.email],
    queryFn: (): boolean => {
      return checkBadge(userData, badge);
    },
    enabled: !isLoadingUser && userData !== undefined,
    initialData: false,
  });
};
