
import CryptoJS from "crypto-js";

const SECRET_KEY = import.meta.env.VITE_SECRET; 

export const encrypt = (text) => {
  if (typeof text !== "string") {
    text = String(text);
  }

  if (!text) {
    throw new Error("Invalid input to encrypt");
  }

  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
};

export const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};