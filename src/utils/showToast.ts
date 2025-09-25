// utils/toastUtil.ts
import toast from "react-hot-toast";

export const showToast = (message: string, success: boolean) => {
  if (success) {
    toast.success(message, {
      style: {
        background: "#16a34a", // Tailwind green-600
        color: "#fff",
        fontWeight: "500",
      },
      icon: "✅",
    });
  } else {
    toast.error(message, {
      style: {
        background: "#dc2626", // Tailwind red-600
        color: "#fff",
        fontWeight: "500",
      },
      icon: "❌",
    });
  }
};
