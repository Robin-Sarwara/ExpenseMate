import { toast } from "react-toastify";

export const showSuccessToast = (msg) => {
  toast.success(msg, {
    position: "top-right",
    autoClose: 3000,
  });
};

export const showErrorToast = (msg) => {
  toast.error(msg, {
    position: "top-right",
    autoClose: 3000,
  });
};
