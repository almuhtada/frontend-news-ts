import { useState } from "react";
import { Send } from "lucide-react";

type Comment = {
  id: number;
  name: string;
  content: string;
  createdAt: string;
};

const dummyComments: Comment[] = [
  {
    id: 1,
    name: "Rafa",
    content: "Tulisan ini enak dibaca dan informatif.",
    createdAt: "2 jam lalu",
  },
  {
    id: 2,
    name: "Anonim",
    content: "Semoga ada pembahasan lanjutan ke depannya.",
    createdAt: "1 jam lalu",
  },
];

const ArticleComments = () => {
  const [comments, setComments] = useState<Comment[]>(dummyComments);
  const [text, setText] = useState("");

  const submitComment = () => {
    if (!text.trim()) return;

    setComments([
      {
        id: Date.now(),
        name: "Anonim",
        content: text,
        createdAt: "baru saja",
      },
      ...comments,
    ]);

    setText("");
  };

  return (
    <section className="mt-14">
      {/* SECTION TITLE */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
          Komentar
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({comments.length})
          </span>
        </h3>
      </div>

      {/* COMMENT FORM */}
      <div className="mb-10">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis pendapat Anda secara sopan dan relevan…"
            rows={3}
            className="
              w-full resize-none bg-transparent text-sm text-gray-800
              placeholder:text-gray-400
              focus:outline-none
            "
          />

          <div className="flex items-center justify-end mt-4">
            <button
              onClick={submitComment}
              className="
                inline-flex items-center gap-2
                px-5 py-2 rounded-full
                bg-emerald-600 text-white
                text-sm font-medium
                hover:bg-emerald-700
                transition
              "
            >
              <Send className="w-4 h-4" />
              Kirim
            </button>
          </div>
        </div>
      </div>

      {/* COMMENT LIST */}
      <div className="space-y-8">
        {comments.map((c) => (
          <article key={c.id} className="border-b border-gray-100 pb-6">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-gray-900">{c.name}</p>
              <span className="text-xs text-gray-400">{c.createdAt}</span>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
              {c.content}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ArticleComments;
