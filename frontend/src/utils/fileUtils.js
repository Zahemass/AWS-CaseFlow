import { formatFileSize } from './formatters';

// Read file content as text
export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
};

// Get file extension
export const getFileExtension = (filename) =>
  filename.split('.').pop().toLowerCase();

// Generate metadata for file
export const getFileMetadata = (file) => ({
  name: file.name,
  type: file.type,
  size: formatFileSize(file.size),
  lastModified: new Date(file.lastModified).toLocaleString(),
});

// Filter valid files
export const filterValidFiles = (files, allowedTypes, maxSize) =>
  Array.from(files).filter(
    (file) =>
      allowedTypes.includes('.' + getFileExtension(file)) && file.size <= maxSize
  );
