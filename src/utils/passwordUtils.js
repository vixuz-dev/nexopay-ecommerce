import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_APP_SECRET_KEY;

export const hashPassword = (password) => {
  try {
    const hash = CryptoJS.HmacSHA512(password, SECRET_KEY);
    return hash.toString(CryptoJS.enc.Hex);
  } catch (error) {
    console.error("Error al hashear contraseña:", error);
    throw new Error("Error al hashear la contraseña");
  }
};