<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/bd.php'; 

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    exit(json_encode(['success' => false]));
}


$input = json_decode(file_get_contents('php://input'), true);
$eventId = $input['event_id'] ?? null;
$pageUrl = $input['url'] ?? $_SERVER['HTTP_REFERER'] ?? '';

$pixelId = $_ENV['META_PIXEL'] ?? null;
$apiToken = $_ENV['META_TOKEN'] ?? null;

if ($pixelId && $apiToken && $eventId) {
    try {

        $fbp = $_COOKIE['_fbp'] ?? null;
        $fbc = $_COOKIE['_fbc'] ?? null;

        $eventData = [
            'data' => [[
                'event_name' => 'PageView', 
                'event_time' => time(),   
                'action_source' => 'website',
                'event_source_url' => $pageUrl, 
                'event_id' => $eventId, 
                
                'user_data' => [
                    'client_ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                    'client_user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                    'fbp' => $fbp,
                    'fbc' => $fbc
                ]
            ]]
        ];

        $url = "https://graph.facebook.com/v19.0/{$pixelId}/events";
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($eventData));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/json",
            "Authorization: Bearer {$apiToken}"
        ]);

        $response = curl_exec($ch);
        
    } catch (\Exception $e) {
    }
}

echo json_encode(['success' => true]);