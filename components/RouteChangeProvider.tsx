'use client';
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // Next.js navigation hook

type RouteChangeContextType = {
  loading: boolean;
  setLoading: (val: boolean) => void;
};

const RouteChangeContext = createContext<RouteChangeContextType>({
  loading: false,
  setLoading: () => {},
});

export function useRouteChange() {
  return useContext(RouteChangeContext);
}

export function RouteChangeProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Trigger loader on route changes
    if (pathname) {
      setLoading(true);
      const timeout = setTimeout(() => setLoading(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [pathname]);

  return (
    <RouteChangeContext.Provider value={{ loading, setLoading }}>
      {children}
    </RouteChangeContext.Provider>
  );
}
