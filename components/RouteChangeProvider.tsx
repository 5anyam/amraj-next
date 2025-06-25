
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

type RouteChangeContextType = {
  loading: boolean;
  setLoading: (val: boolean) => void;
};

const RouteChangeContext = createContext<RouteChangeContextType>({ loading: false, setLoading: () => {} });

export function useRouteChange() {
  return useContext(RouteChangeContext);
}

export function RouteChangeProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // When the location changes, show loader briefly
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 600); // You can tweak this for smoothness
    return () => clearTimeout(timeout);
  }, [location, navigationType]);

  return (
    <RouteChangeContext.Provider value={{ loading, setLoading }}>
      {children}
    </RouteChangeContext.Provider>
  );
}
