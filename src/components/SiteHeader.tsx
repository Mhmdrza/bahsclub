import { getSiteConfig } from "@/lib/content";
import { SiteHeaderClient } from "@/components/SiteHeaderClient";

export function SiteHeader() {
  const config = getSiteConfig();
  return <SiteHeaderClient config={config} />;
}