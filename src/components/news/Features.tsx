const features = [
  {
    id: 1,
    title: "Belajar Tajwid dengan Mudah dan Menyenangkan",
    tag: "FEATURE",
    excerpt:
      "Panduan praktis belajar tajwid agar membaca Al-Qur'an lebih fasih dan benar.",
  },
  {
    id: 2,
    title: "Tips Menjaga Shalat Tepat Waktu",
    tag: "FEATURE",
    excerpt:
      "Langkah-langkah sederhana agar shalat tetap konsisten di tengah kesibukan.",
  },
  {
    id: 3,
    title: "Memahami Doa-doa Harian Nabi Muhammad",
    tag: "FEATURE",
    excerpt:
      "Doa-doa singkat tapi penuh makna yang bisa diamalkan setiap hari.",
  },
];

const Features = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-gray-200/60 dark:border-gray-800/80 pb-6 mb-6">
      {features.map((f) => (
        <div
          key={f.id}
          className="bg-transparent flex flex-col justify-between py-1"
        >
          <div>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {f.tag}
            </span>
            <h4 className="mt-1.5 font-bold text-base text-gray-900 dark:text-gray-100 leading-snug">{f.title}</h4>
            <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {f.excerpt}
            </p>
          </div>
          <div className="mt-4 text-xs font-semibold text-emerald-600 dark:text-emerald-400 cursor-pointer hover:underline">
            Baca selengkapnya →
          </div>
        </div>
      ))}
    </div>
  );
};

export default Features;
