/**
 * Adresy backendu.
 *
 * Strona ma dwa tryby działania:
 *  - z serwerem Node — backendem są trasy `/api/*` z Next.js,
 *  - statycznie na zwykłym hostingu — backendem są skrypty PHP `/api/*.php`.
 *
 * Wersja statyczna wstrzykuje do HTML `window.__API_PHP__ = true`, a komponenty
 * korzystają z tych funkcji, więc ten sam kod obsługuje oba warianty.
 */

declare global {
  interface Window {
    __API_PHP__?: boolean;
  }
}

export type ApiName = "auth" | "content" | "portfolio" | "upload" | "translate" | "sync";

export function isPhpBackend(): boolean {
  return typeof window !== "undefined" && window.__API_PHP__ === true;
}

export function apiUrl(name: ApiName): string {
  return isPhpBackend() ? `/api/${name}.php` : `/api/${name}`;
}

/**
 * Adres do ODCZYTU treści przez stronę.
 *
 * Celowo bez rozszerzenia .php: w wersji z Node obsługuje go trasa Next.js,
 * a w wersji statycznej to zwykły plik zapisywany przez PHP. Dzięki temu
 * strona wyświetla się nawet wtedy, gdy PHP na serwerze nie działa —
 * do wczytania treści nie jest potrzebny żaden proces.
 */
export function dataUrl(name: "content" | "portfolio"): string {
  return `/api/${name}`;
}

/** Adres pojedynczej pozycji galerii — w PHP identyfikator idzie w parametrze. */
export function apiItemUrl(id: string, method: "PUT" | "DELETE"): string {
  return isPhpBackend()
    ? `/api/portfolio.php?id=${encodeURIComponent(id)}&_method=${method}`
    : `/api/portfolio/${encodeURIComponent(id)}`;
}

/**
 * Metoda żądania dla operacji na pozycji galerii.
 * Część hostingów blokuje PUT i DELETE, więc w trybie PHP wysyłamy POST,
 * a właściwą metodę przekazujemy w parametrze `_method`.
 */
export function apiItemMethod(method: "PUT" | "DELETE"): string {
  return isPhpBackend() ? "POST" : method;
}
