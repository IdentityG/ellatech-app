export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
};

export const validateSKU = (sku: string): boolean => {
  const regex = /^[A-Za-z0-9-_]{3,20}$/;
  return regex.test(sku.trim());
};

export const validatePrice = (value: string): boolean => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

export const validateQuantity = (value: string): boolean => {
  const num = parseInt(value, 10);
  return !isNaN(num) && num > 0;
};