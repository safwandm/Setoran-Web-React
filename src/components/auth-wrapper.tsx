// components/ClientAuthWrapper.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ApiService from "@/lib/api-client/wrapper";
import { useCurrentUserStore } from "@/lib/stores/current-user";

const PUBLIC_ROUTES = ["/signin", "/login"];

export default function ClientAuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const setCurrentUser = useCurrentUserStore((state) => state.set)

  useEffect(() => {
    const checkAuth = async () => {
      const apiService = ApiService.getInstance();
      try {
        const currentUser = await apiService.penggunaApi.penggunaCurrentPenggunaGet();
        const isAuthenticated = currentUser && currentUser.isAdmin;
        const path = window.location.pathname;
        const isPublic = PUBLIC_ROUTES.includes(path);

        if (!isAuthenticated && !isPublic) {
          router.replace("/signin");
        } else if (isAuthenticated && isPublic) {
          router.replace("/dashboard");
        }

        if (currentUser) {
          setCurrentUser(currentUser);
        }
      } catch {
        router.replace("/signin");
      }
    };

    checkAuth();

    const handleTokenChange = () => {
      checkAuth();
    };

    window.addEventListener("access_token_updated", handleTokenChange);
    return () => {
      window.removeEventListener("access_token_updated", handleTokenChange);
    };
  }, [router]);

  return <>{children}</>;
}
