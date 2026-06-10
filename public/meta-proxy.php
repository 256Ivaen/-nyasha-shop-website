<?php

/**
 * SEO Meta Proxy for SN Luxe Africa
 *
 * Real users  → served the static Next.js shell instantly
 * Social bots → fetches OG HTML from the Laravel backend transparently
 *
 * No redirects. The URL in the browser/crawler never changes.
 */

$slug = $_GET['slug'] ?? '';
$type = $_GET['type'] ?? '';

if (empty($slug) || empty($type) || $slug === '_') {
    serveShell($type);
    exit;
}

$userAgent = strtolower($_SERVER['HTTP_USER_AGENT'] ?? '');

$botSignatures = [
    'facebookexternalhit', 'facebot', 'twitterbot', 'whatsapp',
    'linkedinbot', 'telegrambot', 'slackbot', 'discordbot',
    'pinterest', 'googlebot', 'bingbot', 'baiduspider',
    'applebot', 'duckduckbot', 'yandexbot', 'semrushbot',
    'ahrefsbot', 'mj12bot', 'crawler', 'spider',
];

$isBot = false;
foreach ($botSignatures as $sig) {
    if (str_contains($userAgent, $sig)) {
        $isBot = true;
        break;
    }
}

if (!$isBot) {
    serveShell($type);
    exit;
}

// Bot detected — fetch OG HTML from Laravel backend
$apiBase = 'https://aquamarine-ram-236798.hostingersite.com/api/v1';
$ogUrl   = $apiBase . '/og/' . $type . '/' . rawurlencode($slug);

$ctx = stream_context_create([
    'http' => [
        'method'          => 'GET',
        'header'          => "Accept: text/html\r\nUser-Agent: OgMetaProxy/1.0\r\n",
        'timeout'         => 5,
        'ignore_errors'   => true,
        'follow_location' => true,
    ],
]);

$html = @file_get_contents($ogUrl, false, $ctx);

if ($html !== false && strlen($html) > 0) {
    header('Content-Type: text/html; charset=UTF-8');
    header('Cache-Control: no-cache, no-store, must-revalidate');
    header('X-Robots-Tag: index, follow');
    echo $html;
} else {
    serveShell($type);
}

function serveShell(string $type): void
{
    // For product pages the shell is at /product/_/index.html
    $shellFile = __DIR__ . '/' . $type . '/_/index.html';
    if (file_exists($shellFile)) {
        header('Content-Type: text/html; charset=UTF-8');
        readfile($shellFile);
    } else {
        // Fall back to root index
        $root = __DIR__ . '/index.html';
        if (file_exists($root)) {
            header('Content-Type: text/html; charset=UTF-8');
            readfile($root);
        }
    }
}
