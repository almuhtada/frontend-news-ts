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
  client = "ca-pub-8836861183221457",
  slot = import.meta.env.VITE_ADSENSE_SLOT || "",
  format = "auto",
  responsive = true,
  style = { display: "block" },
  className = "",
}: AdSenseProps) {
  const adRef = useRef<HTMLModElement>(null);
  const pushedRef = useRef(false);

  // Slot is considered dummy/invalid if empty, "1234567890", or placeholder text
  const isDummySlot =
    !slot ||
    slot === "1234567890" ||
    slot.trim() === "" ||
    slot.trim() === "YOUR_SLOT_ID";

  useEffect(() => {
    if (isDummySlot || pushedRef.current) return;

    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      }
    } catch (err) {
      console.error("AdSense unit error:", err);
    }
  }, [isDummySlot]);

  // If slot is not a real AdSense unit slot ID, do not render broken "Iklan" text or empty box.
  // This allows Google Auto Ads to work cleanly without layout bugs.
  if (isDummySlot) {
    return null;
  }

  return (
    <div className={`adsense-container w-full text-center ${className}`}>
      <span className="block text-[9px] uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1 select-none font-semibold">
        Iklan
      </span>
      <ins
        ref={adRef}
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
