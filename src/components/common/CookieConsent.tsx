import { useEffect, useState } from "react";

const CONSENT_KEY = "almuhtada_cookie_consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(CONSENT_KEY) !== "accepted");
  }, []);

  const setCookieChoice = (choice: "accepted" | "rejected") => {
    localStorage.setItem(CONSENT_KEY, choice);
    setVisible(false);
    if (choice === "rejected") {
      localStorage.removeItem("almuhtada_home_cache");
    }
    if (choice === "accepted") {
      window.dispatchEvent(new Event("almuhtada-cookie-consent"));
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:flex sm:items-center sm:gap-5">
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        Kami menggunakan cookie lokal untuk menyimpan preferensi dan cache
        berita agar halaman berikutnya terbuka lebih cepat.
      </p>
      <div className="mt-3 flex w-full gap-2 sm:mt-0 sm:w-auto sm:flex-shrink-0">
        <button
          type="button"
          onClick={() => setCookieChoice("rejected")}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 sm:flex-none"
        >
          Tolak
        </button>
        <button
          type="button"
          onClick={() => setCookieChoice("accepted")}
          className="flex-1 rounded-lg bg-[#00531b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#003d14] sm:flex-none"
        >
          Terima cookie
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
