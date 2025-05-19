"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ApiService from "@/lib/api-client/wrapper";
import { useCurrentUserStore } from "@/lib/stores/current-user";
import LoadingOverlay from "./loading-overlay";

const PUBLIC_ROUTES = ["/signin", "/login"];

export default function ClientAuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const setCurrentUser = useCurrentUserStore((state) => state.set);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    const handleTokenChange = () => {
      setLoading(true);
      checkAuth();
    };

    window.addEventListener("access_token_updated", handleTokenChange);
    return () => {
      window.removeEventListener("access_token_updated", handleTokenChange);
    };
  }, [router, setCurrentUser]);

  return (
    <LoadingOverlay loading={loading}>
      {children}
    </LoadingOverlay>
  );
}
