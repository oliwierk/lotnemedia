<?php
/**
 * Wgrywanie zdjęć z panelu. Plik trafia do katalogu `uploads/` w katalogu strony,
 * a panel dostaje adres, którego może użyć jako miniatury.
 */

declare(strict_types=1);

require_once __DIR__ . '/_lib.php';

if (request_method() !== 'POST') {
    send_error('Method not allowed', 405);
}

require_admin();

if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
    send_error('Nie przesłano pliku', 400);
}

$file = $_FILES['file'];

if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    $reason = ($file['error'] ?? null) === UPLOAD_ERR_INI_SIZE
        ? 'Plik przekracza limit serwera (upload_max_filesize).'
        : 'Błąd przesyłania pliku.';
    send_error($reason, 400);
}

if (($file['size'] ?? 0) > MAX_UPLOAD_BYTES) {
    send_error('Plik jest za duży (maks. ' . (int) (MAX_UPLOAD_BYTES / 1024 / 1024) . ' MB).', 400);
}

// Typ sprawdzamy po zawartości pliku, nie po nazwie ani nagłówku od przeglądarki.
$info = @getimagesize($file['tmp_name']);
if ($info === false) {
    send_error('Plik nie jest obrazem.', 400);
}

$extensions = [
    IMAGETYPE_JPEG => '.jpg',
    IMAGETYPE_PNG => '.png',
    IMAGETYPE_GIF => '.gif',
    IMAGETYPE_WEBP => '.webp',
];
$ext = $extensions[$info[2]] ?? null;
if ($ext === null) {
    send_error('Dozwolone formaty: JPG, PNG, GIF, WEBP.', 400);
}

// Katalog `uploads` leży obok katalogu `api`, czyli w katalogu głównym strony.
$uploadDir = dirname(__DIR__) . '/uploads';
if (!is_dir($uploadDir) && !mkdir($uploadDir, 0755, true) && !is_dir($uploadDir)) {
    send_error('Nie udało się utworzyć katalogu uploads.', 500);
}
if (!is_writable($uploadDir)) {
    send_error('Katalog uploads nie ma prawa zapisu (ustaw uprawnienia 755).', 500);
}

$name = (string) round(microtime(true) * 1000) . bin2hex(random_bytes(3)) . $ext;
$target = $uploadDir . '/' . $name;

if (!move_uploaded_file($file['tmp_name'], $target)) {
    send_error('Nie udało się zapisać pliku.', 500);
}
@chmod($target, 0644);

send_json(['url' => '/uploads/' . $name]);
