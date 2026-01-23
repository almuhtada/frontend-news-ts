const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition">
    <h2 className="text-xl font-semibold text-indigo-700 mb-4">{title}</h2>
    {children}
  </div>
);
export default SectionCard;
