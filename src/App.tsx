import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import News from "./pages/News";
import SearchResults from "./pages/SearchResults";
import DetailNews from "./pages/detail/detail-news";
import PendidikanPage from "./pages/Pendidikan";
import AuthorPage from "./pages/AuthorPage";
import SejarahPage from "./pages/Sejarah";
import TentangPesantren from "./pages/profile/tentang-pesantren";
import ProgramPengajar from "./pages/profile/program-pengajar";
import PrestasiMahasantri from "./pages/profile/prestasi-mahasantri";
import PublikasiMahasantri from "./pages/profile/publikasi-mahasantri";
import GriyaQuran from "./pages/profile/griya-quran";
import Pendaftaran from "./pages/profile/pendaftaran-mahasantri";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/detail-news/:slug" element={<DetailNews />} />
        <Route path="/category/:slug" element={<SejarahPage />} />
        <Route path="/author/:username" element={<AuthorPage />} />
        <Route path="/pendidikan" element={<PendidikanPage />} />
        <Route path="/program-pengajar" element={<ProgramPengajar />} />
        <Route path="/tentang-pesantren" element={<TentangPesantren />} />
        <Route path="/pendaftaran" element={<Pendaftaran />} />
        <Route path="/prestasi-mahasantri" element={<PrestasiMahasantri />} />
        <Route path="/publikasi-mahasantri" element={<PublikasiMahasantri />} />
        <Route path="/griya-quran" element={<GriyaQuran />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
