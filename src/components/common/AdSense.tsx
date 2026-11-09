import { useEffect, useRef } from "react";

interface AdSenseProps {
  client?: string;
  slot?: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

export default function AdSense({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  client = "ca-pub-8836861183221457",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  slot = import.meta.env.VITE_ADSENSE_SLOT || "",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  format = "auto",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  responsive = true,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  style = { display: "block" },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  className = "",
}: AdSenseProps) {
  // AdSense completely disabled / commented out per request
  return null;
}
