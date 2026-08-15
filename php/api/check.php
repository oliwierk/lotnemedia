<?php
/**
 * Szybka diagnostyka instalacji. Otwórz w przeglądarce: twojadomena.pl/api/check.php
 *
 * Sprawdza to, co najczęściej blokuje panel: brak pliku konfiguracyjnego,
 * brak praw zapisu, brak plików z treścią. Nie pokazuje hasła ani nazwy użytkownika.
 */

declare(strict_types=1);

ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');

$dir = __DIR__;
$result = [
    'php' => PHP_VERSION,
    'configExists' => file_exists($dir . '/config.php'),
];

if (!$result['configExists']) {
    $result['problem'] = 'Brak pliku api/config.php. Skopiuj api/config.example.php jako api/config.php i wpisz w nim hasło.';
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

require_once $dir . '/config.php';

$result['adminUserSet'] = defined('ADMIN_USERNAME') && ADMIN_USERNAME !== '';
$result['adminPassSet'] = defined('ADMIN_PASSWORD') && ADMIN_PASSWORD !== '';
$result['passwordStillDefault'] = defined('ADMIN_PASSWORD')
    && ADMIN_PASSWORD === 'tu-wpisz-dlugie-losowe-haslo';
// Długość podajemy zamiast hasła — pozwala wykryć np. przypadkową spację na końcu.
$result['passwordLength'] = defined('ADMIN_PASSWORD') ? strlen(ADMIN_PASSWORD) : 0;
$result['usernameLength'] = defined('ADMIN_USERNAME') ? strlen(ADMIN_USERNAME) : 0;

$result['contentFile'] = [
    'exists' => file_exists($dir . '/content'),
    'writable' => is_writable($dir . '/content'),
];
$result['portfolioFile'] = [
    'exists' => file_exists($dir . '/portfolio'),
    'writable' => is_writable($dir . '/portfolio'),
];
$uploads = dirname($dir) . '/uploads';
$result['uploadsDir'] = [
    'exists' => is_dir($uploads),
    'writable' => is_dir($uploads) && is_writable($uploads),
];
$result['curl'] = function_exists('curl_init');

// Które skrypty backendu faktycznie leżą na serwerze — wykrywa niepełne wgranie.
$expected = ['auth.php', 'content.php', 'portfolio.php', 'upload.php', 'translate.php', '_lib.php'];
$missing = array_values(array_filter($expected, static fn($f) => !file_exists($dir . '/' . $f)));
$result['apiFiles'] = $missing === [] ? 'wszystkie obecne' : $missing;
$result['htaccess'] = file_exists($dir . '/.htaccess');

$problems = [];
if ($result['passwordStillDefault']) {
    $problems[] = 'Hasło w config.php nie zostało zmienione.';
}
if (!$result['contentFile']['writable']) {
    $problems[] = 'Plik api/content nie ma prawa zapisu (ustaw 644).';
}
if (!$result['uploadsDir']['writable']) {
    $problems[] = 'Katalog uploads/ nie ma prawa zapisu (ustaw 755).';
}
if ($missing !== []) {
    $problems[] = 'Brakuje plików backendu: ' . implode(', ', $missing) . '.';
}
$result['problem'] = $problems === [] ? 'Brak — konfiguracja wygląda poprawnie.' : implode(' ', $problems);

echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
