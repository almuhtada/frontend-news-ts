import { useState } from "react";
import {
  Mail,
  Link2,
  MessageCircle,
  Share2,
  Check
} from "lucide-react";
import { useToast } from "../../context/ToastContext";

const SocialShare = () => {
  const [copied, setCopied] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const { toast } = useToast();

  // Get current URL
  const currentUrl = window.location.href;
  const pageTitle = document.title;

  // Share handlers
  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${pageTitle}\n\n${currentUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleTwitter = () => {
    const text = encodeURIComponent(pageTitle);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
      '_blank',
      'width=600,height=400'
    );
  };

  const handleTelegram = () => {
    const text = encodeURIComponent(pageTitle);
    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${text}`,
      '_blank'
    );
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(pageTitle);
    const body = encodeURIComponent(`Baca artikel ini:\n\n${currentUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Instagram doesn't have direct share API, but we can copy the link with a message
  const handleInstagram = () => {
    handleCopyLink();
    toast.info('Link telah disalin! Buka Instagram dan paste link di bio atau story Anda.');
  };

  return (
    <div className="mt-6 border-t border-b border-gray-200 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Bagikan Artikel:
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {/* WhatsApp */}
          <button
            onClick={handleWhatsApp}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-all shadow-sm hover:shadow-md"
            title="Share via WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          {/* Facebook */}
          <button
            onClick={handleFacebook}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
            title="Share to Facebook"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="hidden sm:inline">Facebook</span>
          </button>

          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all shadow-sm hover:shadow-md ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title="Copy link"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersalin!</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" />
                <span>Salin Link</span>
              </>
            )}
          </button>

          {/* More Button */}
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-all"
            title="More share options"
          >
            <Share2 className="w-4 h-4" />
            <span>{showMore ? 'Sembunyikan' : 'Lainnya'}</span>
          </button>
        </div>
      </div>

      {/* More Share Options */}
      {showMore && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {/* Twitter */}
            <button
              onClick={handleTwitter}
              className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 transition-all shadow-sm"
              title="Share to Twitter"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              <span>Twitter</span>
            </button>

            {/* LinkedIn */}
            <button
              onClick={handleLinkedIn}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-all shadow-sm"
              title="Share to LinkedIn"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span>LinkedIn</span>
            </button>

            {/* Telegram */}
            <button
              onClick={handleTelegram}
              className="flex items-center gap-2 px-4 py-2 bg-sky-400 text-white text-sm font-medium rounded-lg hover:bg-sky-500 transition-all shadow-sm"
              title="Share via Telegram"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Telegram</span>
            </button>

            {/* Email */}
            <button
              onClick={handleEmail}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-all shadow-sm"
              title="Share via Email"
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>

            {/* Instagram (Copy Link) */}
            <button
              onClick={handleInstagram}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-sm font-medium rounded-lg hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-all shadow-sm"
              title="Share to Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialShare;
