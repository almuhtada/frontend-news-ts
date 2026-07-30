import Navbar from "../../ui/navbar/Navbar";
import Footer from "../../ui/footer/Footer";

interface PublicPageLayoutProps {
  children: React.ReactNode;
}

const PublicPageLayout = ({ children }: PublicPageLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 overflow-x-hidden">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default PublicPageLayout;
