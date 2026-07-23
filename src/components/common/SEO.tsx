import React from "react";
import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = "Pesantren Riset Al-Muhtada - Mencetak Muslim Intelektual Unggul",
  description = "Pesantren Riset Al-Muhtada adalah pesantren mahasiswa di Semarang yang berfokus mencetak muslim intelektual berakhlak mulia, berprestasi, dan terampil riset.",
  keywords = "pesantren riset al-muhtada, pesantren mahasiswa semarang, beasiswa asrama mahasiswa, al-muhtada semarang",
  image = "/src/assets/image/logo1.png",
  url = "https://almuhtada.org",
  type = "website",
}) => {
  const defaultTitle = title.includes("Al-Muhtada") ? title : `${title} | Pesantren Riset Al-Muhtada`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{defaultTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={url} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={defaultTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="Pesantren Riset Al-Muhtada" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={defaultTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default SEO;