export const parseName = (string) => string.substring(
  string.lastIndexOf(".com/") + 5,
  string.lastIndexOf("."),
);
