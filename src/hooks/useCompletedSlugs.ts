"use client";

import { useEffect, useState } from "react";
import { getCompletedSlugs } from "@/lib/progress";

export function useCompletedSlugs(): Set<string> {
  const [slugs, setSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const update = () => setSlugs(new Set(getCompletedSlugs()));
    update();
    window.addEventListener("storage", update);
    window.addEventListener("harfclub:progress", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("harfclub:progress", update);
    };
  }, []);

  return slugs;
}
