// utils/toastUtil.ts
import { toast } from "sonner";

export const showToast = (message: string, success: boolean) => {
  if (success) {
    toast.success(message);
  } else {
    toast.error(message);
  }
};
