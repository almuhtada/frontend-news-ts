import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import News from "./pages/News";
import SearchResults from "./pages/SearchResults";
import DetailNews from "./pages/detail/detail-news";
import AuthorPage from "./pages/AuthorPage";
import CategoryPage from "./pages/Sejarah";
import TentangPesantren from "./pages/profile/tentang-pesantren";
import ProgramPengajar from "./pages/profile/program-pengajar";
import PrestasiMahasantri from "./pages/profile/prestasi-mahasantri";
import PublikasiMahasantri from "./pages/profile/publikasi-mahasantri";
import GriyaQuran from "./pages/profile/griya-quran";
import Pendaftaran from "./pages/profile/pendaftaran-mahasantri";
import PublicPageLayout from "./components/layouts/PublicPageLayout";

function AdSenseRouteHandler() {
  const location = useLocation();

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch {
      // Ignore harmless duplicate push errors during SPA navigation
    }
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AdSenseRouteHandler />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/detail-news/:slug" element={<DetailNews />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/author/:username" element={<AuthorPage />} />
        <Route
          path="/program-pengajar"
          element={
            <PublicPageLayout>
              <ProgramPengajar />
            </PublicPageLayout>
          }
        />
        <Route
          path="/tentang-pesantren"
          element={
            <PublicPageLayout>
              <TentangPesantren />
            </PublicPageLayout>
          }
        />
        <Route
          path="/pendaftaran"
          element={
            <PublicPageLayout>
              <Pendaftaran />
            </PublicPageLayout>
          }
        />
        <Route
          path="/prestasi-mahasantri"
          element={
            <PublicPageLayout>
              <PrestasiMahasantri />
            </PublicPageLayout>
          }
        />
        <Route
          path="/publikasi-mahasantri"
          element={
            <PublicPageLayout>
              <PublikasiMahasantri />
            </PublicPageLayout>
          }
        />
        <Route
          path="/griya-quran"
          element={
            <PublicPageLayout>
              <GriyaQuran />
            </PublicPageLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
