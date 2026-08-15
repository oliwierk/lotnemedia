<?php
/**
 * Treść strony: bio, nagrody i teksty z zakładki „Teksty".
 *
 * GET  — zwraca treść (używa jej także strona w przeglądarce)
 * PUT  — zapisuje zmiany z panelu (wymaga hasła)
 */

declare(strict_types=1);

require_once __DIR__ . '/_lib.php';

const MAX_TEXT_LENGTH = 5000;

/** Domyślna, pusta treść — gdy plik jeszcze nie istnieje. */
function empty_content(): array
{
    return ['bioShort' => '', 'bioFull' => '', 'awards' => [], 'texts' => (object) []];
}

function load_content(): array
{
    $data = read_json(content_path(), empty_content());
    return [
        'bioShort' => is_string($data['bioShort'] ?? null) ? $data['bioShort'] : '',
        'bioFull' => is_string($data['bioFull'] ?? null) ? $data['bioFull'] : '',
        'awards' => is_array($data['awards'] ?? null) ? array_values($data['awards']) : [],
        'texts' => is_array($data['texts'] ?? null) ? $data['texts'] : [],
    ];
}

/** Przepuszczamy tylko pary tekst→tekst o sensownej długości. */
function sanitize_texts($input): ?array
{
    if (!is_array($input)) {
        return null;
    }
    $out = [];
    foreach ($input as $key => $value) {
        if (!is_string($key) || !is_string($value)) {
            continue;
        }
        $out[$key] = mb_substr($value, 0, MAX_TEXT_LENGTH);
    }
    return $out;
}

/** Nagrody: rok, tytuł, organizacja. */
function sanitize_awards($input): array
{
    $out = [];
    foreach ((array) $input as $award) {
        if (!is_array($award)) {
            continue;
        }
        $out[] = [
            'year' => mb_substr((string) ($award['year'] ?? ''), 0, 10),
            'title' => mb_substr((string) ($award['title'] ?? ''), 0, 300),
            'org' => mb_substr((string) ($award['org'] ?? ''), 0, 300),
        ];
    }
    return $out;
}

$method = request_method();

if ($method === 'GET') {
    $content = load_content();
    // Pusta mapa tekstów musi zostać obiektem, nie tablicą — inaczej JS dostanie [].
    if ($content['texts'] === []) {
        $content['texts'] = (object) [];
    }
    send_json($content);
}

if ($method !== 'PUT' && $method !== 'POST') {
    send_error('Method not allowed', 405);
}

require_admin();

$body = read_body();
$content = load_content();

if (isset($body['bioShort']) && is_string($body['bioShort'])) {
    $content['bioShort'] = $body['bioShort'];
}
if (isset($body['bioFull']) && is_string($body['bioFull'])) {
    $content['bioFull'] = $body['bioFull'];
}
if (isset($body['awards'])) {
    $content['awards'] = sanitize_awards($body['awards']);
}
if (array_key_exists('texts', $body)) {
    $texts = sanitize_texts($body['texts']);
    if ($texts === null) {
        send_error('Invalid texts', 400);
    }
    $content['texts'] = $texts;
}

if (!write_json(content_path(), $content)) {
    send_error('Nie udało się zapisać pliku z treścią. Sprawdź uprawnienia do zapisu.', 500);
}

if ($content['texts'] === []) {
    $content['texts'] = (object) [];
}
$content['dbSynced'] = true;
send_json($content);
