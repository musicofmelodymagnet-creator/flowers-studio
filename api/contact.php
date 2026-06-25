<?php
header('Content-Type: application/json; charset=utf-8');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Parse JSON body
$body = file_get_contents('php://input');
$data = json_decode($body, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid JSON']);
    exit;
}

// Sanitise inputs
$name    = trim(htmlspecialchars($data['name']    ?? '', ENT_QUOTES, 'UTF-8'));
$email   = trim(htmlspecialchars($data['email']   ?? '', ENT_QUOTES, 'UTF-8'));
$date    = trim(htmlspecialchars($data['date']    ?? '', ENT_QUOTES, 'UTF-8'));
$message = trim(htmlspecialchars($data['message'] ?? '', ENT_QUOTES, 'UTF-8'));

if (!$name || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Name, email and message are required']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email address']);
    exit;
}

// ── Claude API ────────────────────────────────────────────────────────────────
// 1) config.php in the project root (shared hosting without env vars)
// 2) environment variable (Docker / VPS)
$configFile = __DIR__ . '/../config.php';
if (file_exists($configFile)) {
    require_once $configFile;
}
$apiKey = defined('CLAUDE_API_KEY') ? CLAUDE_API_KEY : (getenv('CLAUDE_API_KEY') ?: '');

$replyText = "Thank you, {$name}! We received your inquiry and will be in touch within 4 hours.";

if ($apiKey) {
    $dateNote = $date ? "Event date: {$date}." : '';

    $prompt = "You are a warm assistant for FLORINSKY Atelier — a luxury flower wall rental studio in Toronto. "
            . "A client just submitted an inquiry on the website. "
            . "Write a short, warm 1–2 sentence on-screen confirmation message addressed to them by first name. "
            . "Do not write an email subject or greeting, just the message text. "
            . "Client name: {$name}. {$dateNote} "
            . "Message: {$message}";

    $payload = json_encode([
        'model'      => 'claude-haiku-4-5-20251001',
        'max_tokens' => 120,
        'messages'   => [
            ['role' => 'user', 'content' => $prompt]
        ]
    ]);

    $ch = curl_init('https://api.anthropic.com/v1/messages');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'x-api-key: ' . $apiKey,
            'anthropic-version: 2023-06-01',
        ],
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($response && $httpCode === 200) {
        $parsed = json_decode($response, true);
        $text   = $parsed['content'][0]['text'] ?? '';
        if ($text) {
            $replyText = $text;
        }
    }
}

echo json_encode(['success' => true, 'message' => $replyText]);
