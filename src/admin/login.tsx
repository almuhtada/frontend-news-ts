import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, API_ENDPOINTS } from "../config/api";

/* =======================
   Types
======================= */

interface LoginFormData {
  identifier: string;
  password: string;
}

interface LoginErrors {
  identifier?: string;
  password?: string;
  general?: string;
}

interface LoginResponse {
  token: string;
  user: unknown; // ganti dengan interface User kalau sudah ada
  message?: string;
}

/* =======================
   Component
======================= */

const LoginAdmin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginFormData>({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /* =======================
     Handlers
  ======================= */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof LoginErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): LoginErrors => {
    const newErrors: LoginErrors = {};

    if (!formData.identifier.trim()) {
      newErrors.identifier = "Username atau email harus diisi";
    }

    if (!formData.password) {
      newErrors.password = "Password harus diisi";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        setErrors({
          general: data.message ?? "identifier atau password salah",
        });
        return;
      }

      localStorage.setItem("admin_token", data.token);
      localStorage.setItem("admin_user", JSON.stringify(data.user));

      navigate("/admin");
    } catch {
      setErrors({
        general: "Login gagal. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /* =======================
     Render
  ======================= */

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-950 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center">
        <h4 className="text-xl font-semibold mb-4">Login Dashboard</h4>

        <img
          src="/src/assets/image/logo1.png"
          alt="Logo"
          className="w-16 h-16 object-cover rounded-lg mb-6"
        />

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* identifier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usermame or Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Masukkan identifier"
                className={`block w-full pl-10 py-3 border rounded-lg text-sm
                  focus:ring-2 focus:ring-emerald-500
                  ${
                    errors.identifier
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
              />
            </div>
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-600">{errors.identifier}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Masukkan password"
                className={`block w-full pl-10 pr-12 py-3 border rounded-lg text-sm
                  focus:ring-2 focus:ring-emerald-500
                  ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-sm font-semibold text-white
              ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginAdmin;
