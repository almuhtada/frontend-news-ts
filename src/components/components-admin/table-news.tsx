import { Pencil, Trash2, Calendar, User, Tag, FileText } from "lucide-react";
import React from "react";

type Article = {
  id: number;
  title: string;
  category: string;
  content: string;
  image: string;
  author: string;
  editor?: string;
  createdAt: Date;
  updatedAt?: Date;
};

interface Props {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: number) => void;
}

const NewsTable: React.FC<Props> = ({ articles, onEdit, onDelete }) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Politik: "bg-blue-100 text-blue-800 border-blue-200",
      Ekonomi: "bg-green-100 text-green-800 border-green-200",
      Olahraga: "bg-orange-100 text-orange-800 border-orange-200",
      Teknologi: "bg-purple-100 text-purple-800 border-purple-200",
      Kesehatan: "bg-red-100 text-red-800 border-red-200",
      Pendidikan: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  if (articles.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
        <div className="text-center">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Belum ada berita
          </h3>
          <p className="text-gray-500">
            Tambahkan berita pertama Anda untuk memulai.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Daftar Berita ({articles.length})
        </h2>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Gambar
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Artikel
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Tanggal
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {articles.map((article, index) => (
              <tr
                key={article.id}
                className="hover:bg-gray-50 transition-colors duration-200 group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                    {index + 1}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-24 h-16 object-cover rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="max-w-sm">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                      article.category
                    )}`}
                  >
                    <Tag className="w-3 h-3" />
                    {article.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      title="Edit artikel"
                      onClick={() => onEdit(article)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 group/edit"
                    >
                      <Pencil className="w-4 h-4 group-hover/edit:scale-110 transition-transform duration-200" />
                    </button>
                    <button
                      type="button"
                      title="Hapus artikel"
                      onClick={() => onDelete(article.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group/delete"
                    >
                      <Trash2 className="w-4 h-4 group-hover/delete:scale-110 transition-transform duration-200" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        <div className="divide-y divide-gray-200">
          {articles.map((article, index) => (
            <div
              key={article.id}
              className="p-4 hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-2">
                    {index + 1}
                  </div>
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-20 h-14 object-cover rounded-lg shadow-sm border border-gray-200"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <User className="w-4 h-4" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                        article.category
                      )}`}
                    >
                      <Tag className="w-3 h-3" />
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {article.content}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      title="Edit artikel"
                      onClick={() => onEdit(article)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      type="button"
                      title="Hapus artikel"
                      onClick={() => onDelete(article.id)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewsTable;
