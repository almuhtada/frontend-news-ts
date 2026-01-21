const SocialShare = () => {
  return (
    <div className="mt-6 flex items-center gap-3">
      <span className="text-sm text-gray-600">Bagikan:</span>
      <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700 transition-colors">
        Facebook
      </button>
      <button className="px-3 py-1 bg-sky-500 text-white text-xs rounded-full hover:bg-sky-600 transition-colors">
        Twitter
      </button>
      <button className="px-3 py-1 bg-green-600 text-white text-xs rounded-full hover:bg-green-700 transition-colors">
        WhatsApp
      </button>
    </div>
  );
};

export default SocialShare;
