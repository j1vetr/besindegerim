import React from "react";

interface ClientOnlyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  // SSR-safe check - window is undefined during SSR
  if (typeof window === 'undefined') {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
