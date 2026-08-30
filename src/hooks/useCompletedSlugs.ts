"use client";

import { useEffect, useState } from "react";
import { getCompletedSlugs } from "@/lib/progress";

export function useCompletedSlugs(): Set<string> {
  const [slugs, setSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const update = () => setSlugs(new Set(getCompletedSlugs()));
    update();
    window.addEventListener("storage", update);
    window.addEventListener("bahsclub:progress", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("bahsclub:progress", update);
    };
  }, []);

  return slugs;
}
