import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import News from "./pages/News";
import Navbar from "./ui/navbar/Navbar";
import Footer from "./ui/footer/Footer";
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
import ProtectedRoute from "./components/common/ProtectedRoute";

// Layout umum untuk halaman publik
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex-1">{children}</div>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Halaman publik pakai layout dengan navbar & footer */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />

        <Route
          path="/news"
          element={
            <PublicLayout>
              <News />
            </PublicLayout>
          }
        />
        <Route
          path="/detail-news/:slug"
          element={
            <PublicLayout>
              <DetailNews />
            </PublicLayout>
          }
        />
        <Route
          path="/category/:slug"
          element={
            <PublicLayout>
              <SejarahPage />
            </PublicLayout>
          }
        />
        <Route
          path="/author/:username"
          element={
            <PublicLayout>
              <AuthorPage />
            </PublicLayout>
          }
        />
        <Route
          path="/pendidikan"
          element={
            <PublicLayout>
              <PendidikanPage />
            </PublicLayout>
          }
        />
        <Route
          path="/program-pengajar"
          element={
            <PublicLayout>
              <ProgramPengajar />
            </PublicLayout>
          }
        />
        <Route
          path="/tentang-pesantren"
          element={
            <PublicLayout>
              <TentangPesantren />
            </PublicLayout>
          }
        />
        <Route
          path="/pendaftaran"
          element={
            <PublicLayout>
              <Pendaftaran />
            </PublicLayout>
          }
        />
        <Route
          path="/prestasi-mahasantri"
          element={
            <PublicLayout>
              <PrestasiMahasantri />
            </PublicLayout>
          }
        />
        <Route
          path="/publikasi-mahasantri"
          element={
            <PublicLayout>
              <PublikasiMahasantri />
            </PublicLayout>
          }
        />
        <Route
          path="/griya-quran"
          element={
            <PublicLayout>
              <GriyaQuran />
            </PublicLayout>
          }
        />

        {/* Halaman login admin pakai layout kosong */}
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
