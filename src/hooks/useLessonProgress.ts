"use client";

import { useEffect, useMemo, useState } from "react";
import { getLessonProgress } from "@/lib/progress";

export function useLessonProgress(
  stepSlugs: string[],
  validSlugs: Set<string>
) {
  const [progress, setProgress] = useState({ completed: 0, total: 0 });

  // Derive stable string keys from the actual values so the effect
  // only re-runs when the *contents* change, not when a new Set/Array
  // reference is created on every render.
  const slugKey = useMemo(() => stepSlugs.join(","), [stepSlugs]);
  const validKey = useMemo(
    () => Array.from(validSlugs).sort().join(","),
    [validSlugs]
  );

  useEffect(() => {
    const update = () => {
      setProgress(getLessonProgress(stepSlugs, validSlugs));
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("bahsclub:progress", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("bahsclub:progress", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugKey, validKey]);

  return progress;
}