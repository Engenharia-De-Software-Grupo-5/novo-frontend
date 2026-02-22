export function secureRandom(length: number): string {
  const array = new Uint8Array(length);
  globalThis.crypto.getRandomValues(array);
  return Array.from(array, (byte) => (byte % 10).toString())
    .join('')
    .slice(0, length);
}
