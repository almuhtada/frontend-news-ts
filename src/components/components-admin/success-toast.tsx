import { CheckCircle } from "lucide-react";

type SuccessToastProps = {
  message: string;
};

const SuccessToast = ({ message }: SuccessToastProps) => (
  <div className="fixed top-6 right-6 z-50 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-in-right">
    <CheckCircle className="w-6 h-6" />
    <div>
      <p className="font-semibold">Berhasil!</p>
      <p className="text-sm opacity-90">{message}</p>
    </div>
  </div>
);

export default SuccessToast;
