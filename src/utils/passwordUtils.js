import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY;

export const hashPassword = (password) => {
  try {
    return CryptoJS.SHA256(password + SECRET_KEY).toString();
  } catch (error) {
    console.error("Error al hashear contraseña:", error);
    throw new Error("Error al hashear la contraseña");
  }
};

