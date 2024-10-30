import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "qs"; // Import the qs library

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const convertFileToUrl = (file) => URL.createObjectURL(file);

export function formUrlQuery({ params, key, value }) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  // Manually construct the full URL
  const queryString = qs.stringify(currentUrl, { skipNull: true });
  return `${window.location.pathname}?${queryString}`;
}

export function removeKeysFromQuery({ params, keysToRemove }) {
  const currentUrl = qs.parse(params);

  keysToRemove.forEach((key) => {
    delete currentUrl[key];
  });

  // Manually construct the full URL
  const queryString = qs.stringify(currentUrl, { skipNull: true });
  return `${window.location.pathname}?${queryString}`;
}
