/**
 * Numer telefonu (wpisywany w panelu, w dowolnym formacie) → adres `tel:` zgodny z RFC 3966.
 *
 * Telefon po zeskanowaniu kodu QR rozpoznaje `tel:` jako numer do wybrania, ale tylko
 * jeśli numer jest w formacie międzynarodowym. Dlatego numer krajowy (9 cyfr)
 * uzupełniamy o polski prefiks +48.
 */
export function telUri(raw: string): string {
  const digits = normalizePhone(raw);
  return digits ? `tel:${digits}` : "";
}

/** Sam numer w formacie międzynarodowym (np. "+48512555780") albo "" gdy nie da się go odczytać. */
export function normalizePhone(raw: string): string {
  if (!raw) return "";

  // Zostawiamy tylko cyfry i wiodący plus.
  const hasPlus = raw.trim().startsWith("+");
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  if (hasPlus) return `+${digits}`;
  // Zapis międzynarodowy z zerami, np. 0048 512 555 780.
  if (digits.startsWith("00")) return `+${digits.slice(2)}`;
  // Numer krajowy: 9 cyfr (komórka lub stacjonarny z kierunkowym).
  if (digits.length === 9) return `+48${digits}`;
  // Numer z kierunkowym kraju, ale bez plusa, np. 48512555780.
  if (digits.length === 11 && digits.startsWith("48")) return `+${digits}`;
  // Numer krajowy zapisany z wiodącym zerem, np. 0512555780.
  if (digits.length === 10 && digits.startsWith("0")) return `+48${digits.slice(1)}`;

  return `+${digits}`;
}
