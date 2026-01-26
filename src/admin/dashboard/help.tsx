import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, FileText, Users, Bell, Award, HelpCircle, Mail } from "lucide-react";
import Sidebar from "../../components/components-admin/sidebar";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Manajemen Berita
  {
    category: "Manajemen Berita",
    question: "Bagaimana cara menambah artikel baru?",
    answer: "Klik menu 'Manajemen Berita' di sidebar, lalu klik tombol 'Tambah Artikel' di pojok kanan atas. Isi form dengan judul, konten, kategori, dan gambar featured. Setelah selesai, klik 'Simpan' untuk menyimpan sebagai draft atau 'Publish' untuk langsung mempublikasikan."
  },
  {
    category: "Manajemen Berita",
    question: "Bagaimana cara mengedit artikel yang sudah ada?",
    answer: "Di halaman Manajemen Berita, cari artikel yang ingin diedit. Arahkan mouse ke card artikel dan klik ikon Edit (pensil). Form edit akan terbuka dengan data artikel yang sudah terisi. Lakukan perubahan yang diperlukan dan klik Simpan."
  },
  {
    category: "Manajemen Berita",
    question: "Apa perbedaan status Draft dan Publish?",
    answer: "Draft adalah artikel yang belum dipublikasikan dan hanya bisa dilihat oleh admin. Publish adalah artikel yang sudah dipublikasikan dan bisa dilihat oleh pengunjung website."
  },
  {
    category: "Manajemen Berita",
    question: "Bagaimana cara menambahkan gambar ke artikel?",
    answer: "Saat membuat atau mengedit artikel, klik area upload gambar atau drag & drop file gambar ke area tersebut. Format yang didukung: JPG, PNG, GIF. Ukuran maksimal: 5MB."
  },

  // Manajemen Prestasi
  {
    category: "Manajemen Prestasi",
    question: "Bagaimana cara menambah prestasi baru?",
    answer: "Klik menu 'Manajemen Prestasi' di sidebar, lalu klik tombol 'Tambah Prestasi'. Isi nama prestasi, deskripsi, tanggal, dan upload bukti/sertifikat jika ada."
  },

  // Publikasi Jurnal
  {
    category: "Publikasi Jurnal",
    question: "Bagaimana cara menambah jurnal?",
    answer: "Klik menu 'Publikasi Jurnal' di sidebar, lalu klik 'Tambah Jurnal'. Isi judul jurnal, abstrak, penulis, dan upload file PDF jurnal."
  },

  // Notifikasi
  {
    category: "Notifikasi",
    question: "Apa saja jenis notifikasi yang ada?",
    answer: "Ada beberapa jenis notifikasi: komentar baru pada artikel, artikel yang perlu direview, dan pengingat untuk konten yang sudah lama tidak diupdate."
  },

  // Profile
  {
    category: "Profile Pengguna",
    question: "Bagaimana cara mengubah password?",
    answer: "Klik menu 'Profile Pengguna' di sidebar. Di bagian keamanan, masukkan password lama, password baru, dan konfirmasi password baru. Klik Simpan untuk menyimpan perubahan."
  },
  {
    category: "Profile Pengguna",
    question: "Bagaimana cara mengubah foto profile?",
    answer: "Klik menu 'Profile Pengguna', lalu klik foto profile Anda atau ikon kamera. Pilih foto baru dari komputer Anda. Foto akan otomatis terupload dan tersimpan."
  },

  // Umum
  {
    category: "Umum",
    question: "Bagaimana cara logout dari dashboard?",
    answer: "Klik tombol 'Keluar' di bagian bawah sidebar. Konfirmasi logout pada dialog yang muncul."
  },
  {
    category: "Umum",
    question: "Siapa yang bisa saya hubungi jika ada masalah?",
    answer: "Jika mengalami masalah teknis, silakan hubungi tim IT di email: support@almuhtada.org atau WhatsApp: +62 812 3456 7890"
  },
];

const categories = [
  { name: "Semua", icon: HelpCircle },
  { name: "Manajemen Berita", icon: FileText },
  { name: "Manajemen Prestasi", icon: Award },
  { name: "Publikasi Jurnal", icon: BookOpen },
  { name: "Notifikasi", icon: Bell },
  { name: "Profile Pengguna", icon: Users },
  { name: "Umum", icon: HelpCircle },
];

const HelpPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const filteredFaqs = selectedCategory === "Semua"
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Bantuan & Panduan</h1>
          <p className="text-gray-600 mt-1">Temukan jawaban untuk pertanyaan yang sering diajukan</p>
        </div>

        {/* Quick Guide Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl p-6">
            <FileText className="w-8 h-8 mb-3" />
            <h3 className="font-bold text-lg mb-2">Kelola Berita</h3>
            <p className="text-blue-100 text-sm">Tambah, edit, dan hapus artikel berita dengan mudah</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-3xl p-6">
            <Award className="w-8 h-8 mb-3" />
            <h3 className="font-bold text-lg mb-2">Dokumentasi Prestasi</h3>
            <p className="text-green-100 text-sm">Catat pencapaian dan prestasi pesantren</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-3xl p-6">
            <BookOpen className="w-8 h-8 mb-3" />
            <h3 className="font-bold text-lg mb-2">Publikasi Jurnal</h3>
            <p className="text-purple-100 text-sm">Upload dan kelola jurnal penelitian</p>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-4">Filter Kategori</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === cat.name
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <cat.icon className="w-4 h-4" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="bg-white rounded-3xl shadow-lg p-6">
          <h2 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-green-600" />
            Pertanyaan yang Sering Diajukan
          </h2>

          <div className="space-y-3">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-100 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-lg">
                      {faq.category}
                    </span>
                    <span className="font-medium text-gray-800">{faq.question}</span>
                  </div>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {openIndex === index && (
                  <div className="px-4 pb-4">
                    <div className="bg-gray-50 rounded-xl p-4 text-gray-600 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada FAQ untuk kategori ini
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/20 rounded-2xl">
              <Mail className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Masih butuh bantuan?</h3>
              <p className="text-green-100">Hubungi tim support kami di support@almuhtada.org</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpPage;
