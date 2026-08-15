<?php
/**
 * Tłumaczenie PL → EN dla panelu (odpowiednik trasy /api/translate z wersji Node).
 *
 * Domyślnie MyMemory — darmowe, bez klucza. Gdy w config.php jest DEEPL_API_KEY,
 * używa DeepL i wraca do MyMemory, jeśli ten zawiedzie.
 */

declare(strict_types=1);

require_once __DIR__ . '/_lib.php';

const MAX_TEXTS = 60;
const MAX_CHARS_PER_TEXT = 5000;
/** MyMemory obcina długie zapytania — dłuższe teksty tniemy na kawałki. */
const MYMEMORY_CHUNK = 480;

if (request_method() !== 'POST') {
    send_error('Method not allowed', 405);
}

/** Prosty klient HTTP: cURL, a gdy go brak — file_get_contents. */
function http_post_json(string $url, array $headers, string $body, int $timeout = 20): ?string
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $body,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_TIMEOUT => $timeout,
        ]);
        $out = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ($out === false || $code >= 400) ? null : (string) $out;
    }

    $ctx = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => implode("\r\n", $headers),
            'content' => $body,
            'timeout' => $timeout,
            'ignore_errors' => true,
        ],
    ]);
    $out = @file_get_contents($url, false, $ctx);
    return $out === false ? null : $out;
}

function http_get(string $url, int $timeout = 20): ?string
{
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => $timeout,
        ]);
        $out = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        return ($out === false || $code >= 400) ? null : (string) $out;
    }

    $ctx = stream_context_create(['http' => ['timeout' => $timeout, 'ignore_errors' => true]]);
    $out = @file_get_contents($url, false, $ctx);
    return $out === false ? null : $out;
}

/** Dzieli tekst na fragmenty ≤ limit, w miarę możliwości na granicy zdań. */
function chunk_text(string $text, int $limit = MYMEMORY_CHUNK): array
{
    if (mb_strlen($text) <= $limit) {
        return [$text];
    }
    $chunks = [];
    $current = '';
    $sentences = preg_split('/(?<=[.!?])\s+/u', $text) ?: [$text];
    foreach ($sentences as $sentence) {
        if (mb_strlen($sentence) > $limit) {
            // Pojedyncze zdanie dłuższe niż limit — tniemy po słowach.
            foreach (explode(' ', $sentence) as $word) {
                if ($current !== '' && mb_strlen($current . ' ' . $word) > $limit) {
                    $chunks[] = trim($current);
                    $current = '';
                }
                $current .= ($current === '' ? '' : ' ') . $word;
            }
            continue;
        }
        if ($current !== '' && mb_strlen($current . ' ' . $sentence) > $limit) {
            $chunks[] = trim($current);
            $current = '';
        }
        $current .= ($current === '' ? '' : ' ') . $sentence;
    }
    if (trim($current) !== '') {
        $chunks[] = trim($current);
    }
    return $chunks;
}

function translate_mymemory(string $text): ?string
{
    // Puste linie zachowujemy, żeby nie gubić akapitów.
    $lines = explode("\n", $text);
    $out = [];

    foreach ($lines as $line) {
        if (trim($line) === '') {
            $out[] = $line;
            continue;
        }
        $parts = [];
        foreach (chunk_text($line) as $chunk) {
            $params = ['q' => $chunk, 'langpair' => 'pl|en'];
            if (MYMEMORY_EMAIL !== '') {
                $params['de'] = MYMEMORY_EMAIL;
            }
            $raw = http_get('https://api.mymemory.translated.net/get?' . http_build_query($params));
            if ($raw === null) {
                return null;
            }
            $data = json_decode($raw, true);
            $translated = $data['responseData']['translatedText'] ?? null;
            if (!is_string($translated) || $translated === '') {
                return null;
            }
            // Przy przekroczeniu limitu MyMemory zwraca komunikat zamiast tłumaczenia.
            if (preg_match('/MYMEMORY WARNING|QUERY LENGTH LIMIT/i', $translated)) {
                return null;
            }
            $parts[] = $translated;
        }
        $out[] = trim(preg_replace('/\s+/u', ' ', implode(' ', $parts)) ?? '');
    }

    return implode("\n", $out);
}

function translate_deepl(array $texts): ?array
{
    $key = trim(DEEPL_API_KEY);
    if ($key === '') {
        return null;
    }
    // Klucze darmowego planu kończą się na ":fx".
    $endpoint = str_ends_with($key, ':fx')
        ? 'https://api-free.deepl.com/v2/translate'
        : 'https://api.deepl.com/v2/translate';

    $raw = http_post_json(
        $endpoint,
        ['Authorization: DeepL-Auth-Key ' . $key, 'Content-Type: application/json'],
        (string) json_encode(['text' => array_values($texts), 'source_lang' => 'PL', 'target_lang' => 'EN-GB'])
    );
    if ($raw === null) {
        return null;
    }
    $data = json_decode($raw, true);
    $translations = $data['translations'] ?? null;
    if (!is_array($translations) || count($translations) !== count($texts)) {
        return null;
    }
    return array_map(static fn($t) => (string) ($t['text'] ?? ''), $translations);
}

$body = read_body();
$input = $body['texts'] ?? null;

if (!is_array($input) || count($input) === 0) {
    send_json(['translations' => []]);
}
if (count($input) > MAX_TEXTS) {
    send_error('Maksymalnie ' . MAX_TEXTS . ' tekstów naraz', 400);
}

$texts = array_map(
    static fn($t) => is_string($t) ? mb_substr($t, 0, MAX_CHARS_PER_TEXT) : '',
    array_values($input)
);

// Puste teksty zostawiamy bez zmian, resztę wysyłamy do tłumaczenia.
$todo = [];
foreach ($texts as $i => $text) {
    if (trim($text) !== '') {
        $todo[$i] = $text;
    }
}

$translations = $texts;

if ($todo !== []) {
    $viaDeepl = translate_deepl($todo);
    if ($viaDeepl !== null) {
        $n = 0;
        foreach (array_keys($todo) as $i) {
            $translations[$i] = $viaDeepl[$n++];
        }
        send_json(['translations' => array_values($translations), 'provider' => 'deepl']);
    }

    foreach ($todo as $i => $text) {
        $translations[$i] = translate_mymemory($text);
    }
}

send_json(['translations' => array_values($translations), 'provider' => 'mymemory']);
