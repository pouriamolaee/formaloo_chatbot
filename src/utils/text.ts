export const removeExtraWhiteSpace = (str: string): string =>
  str.replace(/\s+/g, " ").trim();
