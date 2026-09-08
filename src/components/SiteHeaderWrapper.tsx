"use client";

import { usePathname } from "next/navigation";

export function SiteHeaderWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/club")) return null;
  return <>{children}</>;
}