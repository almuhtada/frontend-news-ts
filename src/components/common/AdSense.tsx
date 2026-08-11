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
    <div className={`adsense-container w-full text-center ${className}`}>
      <span className="block text-[9px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1 select-none font-semibold">
        Iklan
      </span>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? "true" : "false"}
      />
    </div>
  );
}
