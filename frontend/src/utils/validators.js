export const isEmail = (email) => /\S+@\S+\.\S+/.test(email)
export const isEmpty = (val) => !val || val.trim() === ''
