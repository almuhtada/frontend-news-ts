import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import News from "./pages/News";
import SearchResults from "./pages/SearchResults";
import DetailNews from "./pages/detail/detail-news";
import PendidikanPage from "./pages/Pendidikan";
import AuthorPage from "./pages/AuthorPage";
import Dashboard from "./admin/dashboard";

import TentangPesantren from "./pages/profile/tentang-pesantren";
import ProgramPengajar from "./pages/profile/program-pengajar";
import PrestasiMahasantri from "./pages/profile/prestasi-mahasantri";
import PublikasiMahasantri from "./pages/profile/publikasi-mahasantri";
import GriyaQuran from "./pages/profile/griya-quran";
import Pendaftaran from "./pages/profile/pendaftaran-mahasantri";
import LoginAdmin from "./admin/login";
import InputAddNews from "./admin/dashboard/add-news";
import SejarahPage from "./pages/Sejarah";
import AdminAchievements from "./admin/dashboard/add-prestasi";
import AdminPublications from "./admin/dashboard/add-jurnal";
import AdminAbout from "./admin/dashboard/edit-about";
import AdminUsers from "./admin/dashboard/user-profile";
import AdminNotifications from "./admin/dashboard/notification";
import PageContents from "./admin/dashboard/page-contents";
import SettingsPage from "./admin/dashboard/settings";
import HelpPage from "./admin/dashboard/help";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages - layout inside each component */}
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

        {/* Admin pages */}
        <Route path="/login/admin" element={<LoginAdmin />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-news"
          element={
            <ProtectedRoute>
              <InputAddNews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-prestasi"
          element={
            <ProtectedRoute>
              <AdminAchievements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-jurnal"
          element={
            <ProtectedRoute>
              <AdminPublications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-about"
          element={
            <ProtectedRoute>
              <AdminAbout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-profile"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notification"
          element={
            <ProtectedRoute>
              <AdminNotifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/page-contents"
          element={
            <ProtectedRoute>
              <PageContents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/help"
          element={
            <ProtectedRoute>
              <HelpPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
