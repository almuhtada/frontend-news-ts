import { useEffect } from "react";

interface AdSenseProps {
  client?: string;
  slot: string;
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
  client = "ca-pub-8836861183221457",
  slot,
  format = "auto",
  responsive = true,
  style = { display: "block" },
  className = "",
}: AdSenseProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <div className={`adsense-container w-full overflow-hidden flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl py-3 px-2 border border-gray-100/80 dark:border-gray-800/40 min-h-[100px] ${className}`}>
      <span className="text-[9px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5 select-none font-semibold">
        Iklan
      </span>
      <div className="w-full flex items-center justify-center">
        <ins
          className="adsbygoogle"
          style={style}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    </div>
  );
}
