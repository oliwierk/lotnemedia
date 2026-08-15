<?php
/**
 * Wspólne funkcje backendu PHP dla statycznej wersji strony.
 *
 * Zamiast serwera Node treść obsługuje kilka skryptów PHP, które czytają i zapisują
 * te same pliki JSON, z których korzysta strona w przeglądarce:
 *   ../api/content    — bio, nagrody, teksty
 *   ../api/portfolio  — galeria realizacji
 *
 * Dzięki temu panel działa na zwykłym hostingu, bez procesu Node.
 */

declare(strict_types=1);

/**
 * Ostrzeżenia i uwagi PHP nie mogą trafiać do odpowiedzi — zepsułyby JSON,
 * który panel i strona próbują sparsować. Błędy trafiają do logu serwera.
 */
ini_set('display_errors', '0');
ini_set('log_errors', '1');
error_reporting(E_ALL);

// Brak konfiguracji to najczęstszy błąd przy wdrożeniu — zamiast niejasnego
// błędu 500 zwracamy komunikat, który mówi wprost, co zrobić.
if (!file_exists(__DIR__ . '/config.php')) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'error' => 'Brak pliku api/config.php. Skopiuj api/config.example.php jako api/config.php i wpisz w nim hasło.',
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/config.php';

/** Katalog, w którym leżą pliki z treścią (ten sam, co skrypty). */
function data_dir(): string
{
    return __DIR__;
}

function content_path(): string
{
    return data_dir() . '/content';
}

function portfolio_path(): string
{
    return data_dir() . '/portfolio';
}

/** Zwraca odpowiedź JSON i kończy działanie skryptu. */
function send_json($data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function send_error(string $message, int $status = 400): void
{
    send_json(['error' => $message], $status);
}

/** Odczyt pliku JSON. Brak pliku lub uszkodzona treść → wartość zastępcza. */
function read_json(string $path, $fallback)
{
    if (!is_readable($path)) {
        return $fallback;
    }
    $raw = file_get_contents($path);
    if ($raw === false || trim($raw) === '') {
        return $fallback;
    }
    $data = json_decode($raw, true);
    return $data === null ? $fallback : $data;
}

/**
 * Zapis pliku JSON przez plik tymczasowy — przerwany zapis nie zostawi
 * uszkodzonego pliku, z którego czyta strona.
 */
function write_json(string $path, $data): bool
{
    $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if ($json === false) {
        return false;
    }
    $tmp = $path . '.tmp';
    if (file_put_contents($tmp, $json, LOCK_EX) === false) {
        return false;
    }
    return rename($tmp, $path);
}

/** Sprawdza hasło administratora przesłane w nagłówku (tak jak robił to panel w Node). */
function require_admin(): void
{
    $key = $_SERVER['HTTP_X_ADMIN_KEY'] ?? '';
    if (!is_string($key) || $key === '' || !hash_equals(ADMIN_PASSWORD, $key)) {
        send_error('Unauthorized', 401);
    }
}

/** Treść żądania jako tablica. */
function read_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

/** Obsługa zapytania wstępnego przeglądarki i ustalenie metody. */
function request_method(): string
{
    return strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');
}
