<?php
/** Logowanie do panelu — sprawdza użytkownika i hasło z config.php. */

declare(strict_types=1);

require_once __DIR__ . '/_lib.php';

if (request_method() !== 'POST') {
    send_error('Method not allowed', 405);
}

$body = read_body();
$username = is_string($body['username'] ?? null) ? $body['username'] : '';
$password = is_string($body['password'] ?? null) ? $body['password'] : '';

// hash_equals chroni przed odgadywaniem hasła na podstawie czasu odpowiedzi.
$ok = hash_equals(ADMIN_USERNAME, $username) && hash_equals(ADMIN_PASSWORD, $password);

if (!$ok) {
    send_json(['ok' => false], 401);
}

send_json(['ok' => true]);
