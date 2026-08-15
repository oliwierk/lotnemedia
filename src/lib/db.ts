import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

export function isDbConfigured(): boolean {
  return !!process.env.DB_HOST;
}

export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      // Hosting współdzielony ma niski limit jednoczesnych połączeń na użytkownika.
      connectionLimit: 3,
      // Kluczowe: przy błędnej konfiguracji baza ma szybko zwrócić błąd, a nie wisieć.
      // Zawieszone żądanie kończy się ubiciem aplikacji przez Passengera i pętlą
      // restartów, która wyczerpuje limit procesów konta.
      connectTimeout: 5000,
      // Nie kolejkuj żądań w nieskończoność, gdy baza nie odpowiada.
      queueLimit: 20,
    });
  }
  return pool;
}

/**
 * Zapytanie z twardym limitem czasu. Strona woli pokazać treść domyślną
 * niż czekać na bazę, która nie odpowiada.
 */
export async function withTimeout<T>(promise: Promise<T>, ms = 6000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Baza nie odpowiedziała w ${ms} ms`)), ms);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
