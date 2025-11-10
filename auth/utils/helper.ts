export const computeSHA256 = async (file: File) => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

// Computes the SHA-256 hash of a given File object.
// 1. Reads the file as an ArrayBuffer (binary data).
// 2. Uses the Web Crypto API to calculate a SHA-256 digest.
// 3. Converts the resulting binary hash into a readable hex string.
// Returns: A lowercase hexadecimal SHA-256 string (e.g., "9b74c9897b...").
