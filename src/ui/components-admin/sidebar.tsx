import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlusCircle,
  Award,
  BookOpen,
  FileText,
  LayoutDashboard,
  UserPen,
  Menu,
  X,
  Bell,
  LogOut,
  Settings,
  ChevronLeft,
  ChevronRight,
  User,
  HelpCircle,
} from "lucide-react";
import Logo from "../../assets/image/logo1.png";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    // Hapus token dan data user dari localStorage
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    // Redirect ke halaman login
    window.location.href = "/login/admin";
  };

  const menuItems = [
    {
      title: "MAIN MENU",
      items: [
        {
          icon: LayoutDashboard,
          label: "Dashboard",
          href: "/admin",
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          icon: PlusCircle,
          label: "Manajemen Berita",
          href: "/add-news",
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          icon: Award,
          label: "Manajemen Prestasi",
          href: "/add-prestasi",
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          icon: BookOpen,
          label: "Publikasi Jurnal",
          href: "/add-jurnal",
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          icon: FileText,
          label: "Edit Tentang Pesantren",
          href: "/edit-about",
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
        {
          icon: Bell,
          label: "Notifikasi",
          href: "/notification",
          color: "text-green-600",
          bgColor: "bg-green-100",
        },
      ],
    },
    {
      title: "USER MANAGEMENT",
      items: [
        {
          icon: UserPen,
          label: "Profile Pengguna",
          href: "/add-profile",
          color: "text-emerald-600",
          bgColor: "bg-emerald-100",
        },
        {
          icon: Settings,
          label: "Pengaturan",
          href: "/settings",
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        },
      ],
    },
  ];

  const isActiveLink = (href: string) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-2xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-all"
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {/* Desktop Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden lg:block fixed top-6 left-6 z-40 p-2 bg-white rounded-xl shadow-md border border-gray-200 hover:bg-gray-50 transition-all"
        style={{ left: isOpen ? "240px" : "20px" }}
      >
        {isOpen ? (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        )}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{
          x: isOpen || isMobileOpen ? 0 : -300,
          opacity: 1,
          width: isOpen || isMobileOpen ? 280 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`
    fixed lg:static top-0 left-0 bg-gradient-to-b from-white via-slate-50 to-green-50 shadow-2xl z-40 flex flex-col
    ${isMobileOpen ? "flex" : "hidden lg:flex"}
    ${isOpen || isMobileOpen ? "w-[280px]" : "w-0 overflow-hidden"}
  `}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="p-6 border-b border-gray-200/50"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-lg">
              <img
                src={Logo}
                alt="Logo Al-Muhtada"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 leading-tight">
                Al-Muhtada
              </h2>
              <p className="text-xs text-gray-600 font-medium">
                Admin Dashboard
              </p>
            </div>
          </div>
        </motion.div>

        {/* User Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="p-4 mx-4 mt-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl text-white"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-sm">Admin User</p>
              <p className="text-xs text-green-100">Super Administrator</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          {menuItems.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + sectionIndex * 0.1, duration: 0.4 }}
              className="mb-6"
            >
              <h4 className="text-xs font-bold text-gray-400 mb-3 px-2 tracking-wider">
                {section.title}
              </h4>
              <nav className="space-y-1">
                {section.items.map((item, index) => {
                  const isActive = isActiveLink(item.href);
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.4 + sectionIndex * 0.1 + index * 0.05,
                        duration: 0.3,
                      }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`group flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? `${item.bgColor} ${item.color} shadow-md`
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <div
                          className={`p-2 rounded-xl ${
                            isActive
                              ? "bg-white/50"
                              : "bg-gray-100 group-hover:bg-white"
                          } transition-all`}
                        >
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="flex-1">{item.label}</span>
                        {isActive && (
                          <div className="w-2 h-2 bg-current rounded-full opacity-60" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </motion.div>
          ))}
        </div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          className="p-4 border-t border-gray-200/50 space-y-2"
        >
          <Link
            to="/help"
            className="flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
          >
            <div className="p-2 rounded-xl bg-gray-100">
              <HelpCircle className="w-4 h-4" />
            </div>
            <span>Bantuan & Dukungan</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all group"
          >
            <div className="p-2 rounded-xl bg-red-100 group-hover:bg-red-200 transition-all">
              <LogOut className="w-4 h-4" />
            </div>
            <span>Keluar</span>
          </button>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="p-4 text-center"
        >
          <p className="text-xs text-gray-500">
            © 2025 Pesantren Riset Al-Muhtada
          </p>
        </motion.div>
      </motion.aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Konfirmasi Keluar
                </h3>
                <p className="text-sm text-gray-600">
                  Apakah Anda yakin ingin keluar?
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <p className="text-sm text-gray-600 leading-relaxed">
                Anda akan keluar dari dashboard admin dan perlu login kembali
                untuk mengakses sistem.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
              >
                Ya, Keluar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
