export const getASCII = (str) => {
  return Array.from(str).map((char) => char.charCodeAt(0));
};
