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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {features.map((f) => (
        <div
          key={f.id}
          className="bg-white rounded shadow p-4 flex flex-col"
        >
          <div className="text-xs text-indigo-600 font-semibold">
            {f.tag}
          </div>
          <h4 className="mt-2 font-bold">{f.title}</h4>
          <div className="mt-2 text-sm text-gray-600 flex-1">
            {f.excerpt}
          </div>
          <div className="mt-3 text-sm text-gray-500">Read more →</div>
        </div>
      ))}
    </div>
  );
};

export default Features;
