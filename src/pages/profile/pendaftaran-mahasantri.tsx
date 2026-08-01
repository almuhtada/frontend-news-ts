import React, { useState, useEffect } from "react";
import {
  pageContentsService,
  type PendaftaranContent,
} from "../../services/pageContents";
import ProfileHero from "../../components/common/ProfileHero";

const AccountRow: React.FC<{
  bank: string;
  number: string;
  name: string;
  onCopy: (s: string) => void;
  copied: boolean;
}> = ({ bank, number, name, onCopy, copied }) => {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 dark:bg-gray-800">
      <div>
        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
          {bank}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{name}</div>
      </div>

      <div className="flex-1 text-right">
        <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
          {number}
        </div>
      </div>

      <div>
        <button
          onClick={() => onCopy(number)}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition"
          aria-label={`Copy nomor ${bank}`}
        >
          {copied ? (
            <span className="text-green-600 font-medium">Copied</span>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7H6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-2M16 3h5v5M16 3L8 11"
                />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Copy
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const Pendaftaran: React.FC = () => {
  const [content, setContent] = useState<PendaftaranContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response =
          await pageContentsService.getByKey<PendaftaranContent>("pendaftaran");
        if (response.success && response.data?.content) {
          setContent(response.data.content);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleCopy = async (s: string) => {
    try {
      await navigator.clipboard.writeText(s);
      setCopiedNumber(s);
      setTimeout(() => setCopiedNumber(null), 2000);
    } catch {
      setCopiedNumber(s);
      setTimeout(() => setCopiedNumber(null), 2000);
    }
  };

  const makeWhatsAppLink = (phone: string, defaultText?: string) => {
    const raw = phone.replace(/\D/g, "");
    const text = encodeURIComponent(
      defaultText || "Halo, saya ingin konfirmasi pendaftaran PRM",
    );
    return `https://wa.me/${raw}?text=${text}`;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
            <div className="h-8 bg-slate-200 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }
  if (!content) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 text-center text-gray-500">
          Konten tidak tersedia.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <ProfileHero
        title={content.header.title}
        description={content.header.description}
        badge="Pendaftaran Mahasantri"
      >
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex flex-wrap gap-3">
            <a
              href={content.formLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00531b] text-white font-semibold hover:bg-[#006622] shadow-lg shadow-emerald-900/20 transition-all duration-200"
            >
              Daftar Sekarang
            </a>

            {content.whatsappContacts.length > 0 && (
              <a
                href={makeWhatsAppLink(
                  content.whatsappContacts[0].number,
                  "PRM_Nama_Prodi_Alamat",
                )}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold hover:bg-emerald-100 transition-all duration-200"
              >
                Konfirmasi via WhatsApp
              </a>
            )}
          </div>

          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-3 text-center">
            <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">
              Biaya Pendaftaran
            </div>
            <div className="text-xl font-extrabold text-[#00531b] mt-0.5">
              {content.registrationFee}
            </div>
          </div>
        </div>
      </ProfileHero>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Persyaratan + Cara Daftar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Persyaratan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Persyaratan Pendaftaran
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
              {content.requirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
              <li>
                Melakukan pembayaran biaya pendaftaran sebesar{" "}
                <strong>{content.registrationFee}</strong> ke salah satu
                rekening di bawah.
              </li>
              <li>
                Mengisi formulir online melalui laman{" "}
                <a
                  href={content.formLink}
                  className="text-[#00531b] hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {content.formLink}
                </a>{" "}
                dan konfirmasi via WhatsApp (format:{" "}
                <code className="bg-gray-100 px-1 rounded">
                  PRM_Nama_Prodi_Alamat
                </code>
                ).
              </li>
            </ol>
          </div>

          {/* Accounts */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Rekening / Metode Pembayaran
            </h3>
            <div className="space-y-3">
              {content.accounts.map((a) => (
                <AccountRow
                  key={a.bank + a.number}
                  bank={a.bank}
                  number={a.number}
                  name={a.name}
                  copied={copiedNumber === a.number}
                  onCopy={handleCopy}
                />
              ))}
            </div>
            <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
              • Salin nomor rekening lalu lakukan pembayaran. Setelah transfer,
              jangan lupa konfirmasi via WA.
            </p>
          </div>

          {/* Cara Daftar & Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Cara Daftar & Timeline
            </h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">
                  Periode Pendaftaran
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {content.timelineStart} — {content.timelineEnd}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300">
                  Langkah Pendaftaran
                </h4>
                <ol className="list-decimal pl-5 text-gray-700 dark:text-gray-300 space-y-2 text-sm">
                  {content.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Kontak & CTA */}
        <aside className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Kontak Konfirmasi
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Silakan chat via WhatsApp untuk konfirmasi dan pertanyaan.
            </p>

            <div className="space-y-3">
              {content.whatsappContacts.map((c) => (
                <a
                  key={c.number}
                  href={makeWhatsAppLink(c.number, "PRM_Nama_Prodi_Alamat")}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between gap-3 px-4 py-2 rounded-md border border-gray-100 dark:border-gray-700 hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${c.name.replace(
                        /\s+/g,
                        "+",
                      )}&background=0D9488&color=fff&size=32`}
                      alt={c.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-left">
                      <div className="text-sm font-medium text-gray-800">
                        {c.name}
                      </div>
                      <div className="text-xs text-gray-500">{c.number}</div>
                    </div>
                  </div>
                  <div className="text-xs text-green-600 font-medium">
                    Chat WA
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Butuh Bantuan?
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Jika mengalami kendala saat daftar, hubungi kontak resmi di atas.
            </p>
            <a
              href={content.formLink}
              target="_blank"
              rel="noreferrer"
              className="inline-block px-4 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Isi Formulir Pendaftaran
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4 text-center text-xs text-gray-500">
            <div>Format Konfirmasi WA:</div>
            <div className="mt-2 font-mono text-sm">PRM_Nama_Prodi_Alamat</div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Pendaftaran;
