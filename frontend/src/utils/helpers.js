// Generate a random ID
export const generateId = (prefix = 'id') =>
  `${prefix}-${Math.random().toString(36).substring(2, 9)}`;

// Convert snake_case or kebab-case to Title Case
export const toTitleCase = (str) =>
  str.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// Delay function (await sleep)
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Check if two objects are equal (shallow)
export const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// Group array items by key
export const groupBy = (array, key) =>
  array.reduce((acc, item) => {
    const group = item[key] || 'unknown';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
