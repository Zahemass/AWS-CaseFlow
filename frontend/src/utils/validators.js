// Email validation
export const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// Password validation (min 8 chars, 1 uppercase, 1 number)
export const isValidPassword = (password) =>
  /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);

// Name validation (letters & spaces only)
export const isValidName = (name) => /^[a-zA-Z\s]+$/.test(name);

// File type validation
export const isValidFileType = (file, allowedTypes = ['.pdf', '.docx', '.txt']) => {
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  return allowedTypes.includes(ext);
};

// Empty input check
export const isEmpty = (val) =>
  val === undefined || val === null || val.toString().trim() === '';
