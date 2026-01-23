import {
  Calendar,
  Users,
  Image as ImageIcon,
  Edit,
  Trash2,
  Star,
} from "lucide-react";

type NewsGridCardProps = {
  article: any;
  onEdit: (a: any) => void;
  onDelete: (id: number) => void;
  getCategoryColor: (c: string) => string;
  formatDate: (d: Date) => string;
  truncateText: (t: string, l: number) => string;
};

const NewsGridCard = ({
  article,
  onEdit,
  onDelete,
  getCategoryColor,
  formatDate,
  truncateText,
}: NewsGridCardProps) => (
  <div className="group bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
    {/* Image */}
    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100">
      {article.image ? (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-gray-400" />
        </div>
      )}
      {article.featured && (
        <div className="absolute top-3 left-3">
          <div className="bg-yellow-500 text-white px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="w-3 h-3" />
            <span className="text-xs font-medium">Featured</span>
          </div>
        </div>
      )}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          <button
            aria-label="Edit artikel"
            onClick={() => onEdit(article)}
            className="p-2 bg-white/90 hover:bg-white text-blue-600 rounded-xl shadow-lg transition-all"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            aria-label="Hapus artikel"
            onClick={() => onDelete(article.id)}
            className="p-2 bg-white/90 hover:bg-white text-red-600 rounded-xl shadow-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
            article.category
          )}`}
        >
          {article.category}
        </span>
      </div>
      <h3 className="font-bold text-gray-800 text-lg mb-2 leading-tight line-clamp-2">
        {article.title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
        {truncateText(article.content, 120)}
      </p>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <Users className="w-4 h-4" />
          <span>{article.author}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(article.createdAt)}</span>
        </div>
      </div>
    </div>
  </div>
);

export default NewsGridCard;
