import React, { createContext, useContext, useEffect, useState } from 'react';

interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
  fadeDuration?: number; // milliseconds
  mode?: 'spinner' | 'pulse'
}

type LoadingContextType = {
  setLoading: (value: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context.setLoading;
};

export function LoadingOverlay({
  loading,
  children,
  message = 'Loading...',
  fadeDuration = 300,
  mode = "spinner"
}: LoadingOverlayProps) {
  const [showOverlay, setShowOverlay] = useState(loading);
  const [visible, setVisible] = useState(loading);

  useEffect(() => {
    if (loading) {
      setShowOverlay(true);
      setVisible(true);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setShowOverlay(false), fadeDuration);
      return () => clearTimeout(timer);
    }
  }, [loading, fadeDuration]);

  return (
    <div className="relative">
      {children}
      {showOverlay && (
        <div
          className={`absolute inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
            visible ? 'opacity-100' : 'opacity-0'
          } ${mode === "pulse" && "loading-pulse"} bg-white/50 backdrop-blur-md`}
        >
          { mode === "spinner" && (
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
              <span className="text-sm text-gray-700">{message}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export function LoadingOverlayContext({ children, defaultLoadState=true }) {
  const [loading, setLoading] = useState(defaultLoadState)

  return (
  <LoadingContext.Provider value={{ setLoading: setLoading }}>
      <LoadingOverlay loading={loading}>
        {children}
      </LoadingOverlay>
  </LoadingContext.Provider>
  )
}
