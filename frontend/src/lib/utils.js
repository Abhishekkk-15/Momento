import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility to combine Tailwind + conditional classes
export function cn(...inputs) {
  return twMerge(clsx(...inputs)); // <-- spread is needed here
}

// Utility to read a file as Data URL (Base64 string)
export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject("File read failed or not a string.");
      }
    };

    reader.onerror = (err) => reject(err);

    reader.readAsDataURL(file); // <-- Fix typo: readASDataURL -> readAsDataURL
  });
};
