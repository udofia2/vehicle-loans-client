// Re-export all utilities
export { cn } from "./cn";

// Format utilities
export const formatCurrency = (amount: number, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatDate = (date: Date | string) => {
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const formatRelativeTime = (date: Date | string) => {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const now = new Date();
  const target = new Date(date);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return rtf.format(diffHours, "hour");
  }

  return rtf.format(diffDays, "day");
};

// String utilities
export const truncate = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
};

export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Validation utilities
export const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string) => {
  const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
};

export const isValidVIN = (vin: string) => {
  const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/i;
  return vinRegex.test(vin);
};

// Async utilities
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const withRetry = async <T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await sleep(delay);
      return withRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
};
