const ARABIC_TO_LATIN: Record<string, string> = {
  "ء": "",
  "آ": "a",
  "أ": "a",
  "ؤ": "w",
  "إ": "i",
  "ئ": "i",
  "ا": "a",
  "ب": "b",
  "ة": "h",
  "ت": "t",
  "ث": "th",
  "ج": "j",
  "ح": "h",
  "خ": "kh",
  "د": "d",
  "ذ": "dh",
  "ر": "r",
  "ز": "z",
  "س": "s",
  "ش": "sh",
  "ص": "s",
  "ض": "d",
  "ط": "t",
  "ظ": "z",
  "ع": "a",
  "غ": "gh",
  "ف": "f",
  "ق": "q",
  "ك": "k",
  "ل": "l",
  "م": "m",
  "ن": "n",
  "ه": "h",
  "و": "w",
  "ى": "a",
  "ي": "y",
  "ً": "an",
  "ٌ": "un",
  "ٍ": "in",
  "َ": "a",
  "ُ": "u",
  "ِ": "i",
  "ّ": "",
  "ْ": "",
}

export function slugify(input: string): string {
  let result = ""
  for (const char of input.trim()) {
    result += ARABIC_TO_LATIN[char] ?? char
  }
  return result
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}
