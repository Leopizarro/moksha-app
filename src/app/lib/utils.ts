export function firstLetterUpperCase(word: string) {
  if (!word) {
    return "";
  }
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

export function formatToCLP(number: number) {
  if (typeof number !== "number") {
    return 0;
  }
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(number);
}
