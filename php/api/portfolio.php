<?php
/**
 * Galeria realizacji.
 *
 * GET                 — lista pozycji (używa jej także strona)
 * POST                — dodanie pozycji
 * PUT    ?id=xxx      — edycja
 * DELETE ?id=xxx      — usunięcie
 *
 * Metodę można też przekazać jako ?_method=PUT — część hostingów blokuje
 * PUT i DELETE w konfiguracji Apache.
 */

declare(strict_types=1);

require_once __DIR__ . '/_lib.php';

const ALLOWED_TYPES = ['video', 'photo'];

function load_items(): array
{
    $items = read_json(portfolio_path(), []);
    return is_array($items) ? array_values($items) : [];
}

/** Sprowadza pozycję z panelu do znanych pól o rozsądnej długości. */
function sanitize_item(array $input, string $id): array
{
    $type = (string) ($input['type'] ?? 'video');
    if (!in_array($type, ALLOWED_TYPES, true)) {
        $type = 'video';
    }

    $bg = (string) ($input['bg'] ?? '#1a1a1a');
    if (!preg_match('/^#[0-9a-fA-F]{3,8}$/', $bg)) {
        $bg = '#1a1a1a';
    }

    return [
        'id' => $id,
        'type' => $type,
        'title' => mb_substr((string) ($input['title'] ?? ''), 0, 255),
        'category' => mb_substr((string) ($input['category'] ?? ''), 0, 64),
        'youtubeId' => mb_substr((string) ($input['youtubeId'] ?? ''), 0, 32),
        'bg' => $bg,
        'thumbnail' => mb_substr((string) ($input['thumbnail'] ?? ''), 0, 512),
    ];
}

$method = request_method();
// Obejście dla hostingów blokujących PUT/DELETE.
$override = strtoupper((string) ($_GET['_method'] ?? ''));
if ($override !== '' && in_array($override, ['PUT', 'DELETE'], true)) {
    $method = $override;
}

if ($method === 'GET') {
    send_json(load_items());
}

require_admin();

$id = isset($_GET['id']) ? (string) $_GET['id'] : '';
$body = read_body();
$items = load_items();

if ($method === 'POST') {
    $item = sanitize_item($body, 'item_' . (string) round(microtime(true) * 1000));
    $items[] = $item;
    if (!write_json(portfolio_path(), $items)) {
        send_error('Nie udało się zapisać galerii. Sprawdź uprawnienia do zapisu.', 500);
    }
    $item['dbSynced'] = true;
    send_json($item, 201);
}

if ($id === '') {
    send_error('Brak parametru id', 400);
}

if ($method === 'PUT') {
    foreach ($items as $i => $existing) {
        if (($existing['id'] ?? '') === $id) {
            $item = sanitize_item($body, $id);
            $items[$i] = $item;
            if (!write_json(portfolio_path(), $items)) {
                send_error('Nie udało się zapisać galerii.', 500);
            }
            $item['dbSynced'] = true;
            send_json($item);
        }
    }
    send_error('Not found', 404);
}

if ($method === 'DELETE') {
    $filtered = array_values(array_filter($items, static fn($it) => ($it['id'] ?? '') !== $id));
    if (!write_json(portfolio_path(), $filtered)) {
        send_error('Nie udało się zapisać galerii.', 500);
    }
    send_json(['ok' => true, 'dbSynced' => true]);
}

send_error('Method not allowed', 405);
