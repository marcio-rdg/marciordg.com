<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/bd.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'message' => 'Método não permitido.']));
}

if (!empty($_POST['website'])) {
    exit(json_encode(['success' => true, 'message' => 'Lead processado.']));
}

$nome    = filter_input(INPUT_POST, 'ctaNome', FILTER_SANITIZE_SPECIAL_CHARS);
$email   = filter_input(INPUT_POST, 'ctaEmail', FILTER_VALIDATE_EMAIL);
$tel     = preg_replace('/\D/', '', $_POST['ctaTel'] ?? '');
$idBruto = $_POST['desafio'] ?? '';


$configDesafios = [
    'ctaOptionSiteLento' => [
        'nome' => 'Otimização de Site (Lento)',
        'valor_estimado' => 150.00
    ],
    'ctaOptionTracking' => [
        'nome' => 'Tracking & Pixels',
        'valor_estimado' => 50.00 
    ],
    'ctaOptionNewProject' => [
        'nome' => 'Projeto Novo (Zero)',
        'valor_estimado' => 350.00 
    ],
];

$configSelecionada = $configDesafios[$idBruto] ?? null;

$desafioLegivel = $configSelecionada['nome'] ?? null;
$valorLead      = $configSelecionada['valor_estimado'] ?? null;

$errors = [];
if (!$nome || strlen($nome) < 3) $errors[] = "Nome muito curto.";
if (!$email) $errors[] = "E-mail inválido.";
if (strlen($tel) < 10) $errors[] = "Telefone incompleto.";

if (!$configSelecionada) $errors[] = "Opção de desafio inválida.";

if (!empty($errors)) {
    http_response_code(422);
    exit(json_encode(['success' => false, 'errors' => $errors]));
}

try {

    $db = Database::getConnection();

    $sql = "INSERT INTO leads (nome, email, whatsapp, desafio, ip_address, user_agent, origem_url) 
            VALUES (:nome, :email, :tel, :desafio, :ip, :ua, :url)";
    
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':nome'    => $nome,
        ':email'   => $email,
        ':tel'     => $tel,
        ':desafio' => $desafioLegivel,
        ':ip'      => $_SERVER['REMOTE_ADDR'] ?? null,
        ':ua'      => $_SERVER['HTTP_USER_AGENT'] ?? null,
        ':url'     => $_SERVER['HTTP_REFERER'] ?? null
    ]);

    $mail = new PHPMailer(true);
    
    try {
        $mail->isSMTP();
        $mail->Host       = $_ENV['MAIL_HOST'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['MAIL_USER'];
        $mail->Password   = $_ENV['MAIL_PASS'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port       = $_ENV['MAIL_PORT'];
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom($_ENV['MAIL_USER'], $_ENV['MAIL_FROM_NAME']);
        $mail->addAddress($_ENV['MAIL_RECEIVE']);

        $mail->isHTML(true);
        $mail->Subject = "🚀 Novo Lead: $nome ($desafioLegivel)";
        $mail->Body    = "
            <div style='font-family: sans-serif; line-height: 1.6;'>
                <h2>Nova oportunidade capturada!</h2>
                <p><strong>Nome:</strong> $nome</p>
                <p><strong>E-mail:</strong> $email</p>
                <p><strong>WhatsApp:</strong> <a href='https://wa.me/$tel'>$tel</a></p>
                <p><strong>Desafio:</strong> $desafioLegivel</p>
                <p><strong>Valor Estimado (CAPI):</strong> R$ " . number_format($valorLead, 2, ',', '.') . "</p>
                <p style='color: #666; font-size: 12px;'>IP: {$_SERVER['REMOTE_ADDR']}</p>
            </div>
        ";

        $mail->send();
    } catch (Exception $e) {
        error_log("MAIL_ERROR: " . $mail->ErrorInfo);
    }

    $pixelId = $_ENV['META_PIXEL'] ?? null;
    $apiToken = $_ENV['META_TOKEN'] ?? null;

    if ($pixelId && $apiToken) {
        try {
            $hashedEmail = hash('sha256', strtolower(trim($email)));
            $hashedTel   = hash('sha256', $tel);

            $eventId = bin2hex(random_bytes(16));

            $eventData = [
                'data' => [[
                    'event_name' => 'Lead', 
                    'event_time' => time(),   
                    'action_source' => 'website',
                    'event_source_url' => $_SERVER['HTTP_REFERER'] ?? '', 
                    'event_id' => $eventId,
                    
                    'user_data' => [
                        'em' => $hashedEmail,
                        'ph' => $hashedTel,
                        'client_ip_address' => $_SERVER['REMOTE_ADDR'] ?? null,
                        'client_user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? null,
                    ],
                    
                    'custom_data' => [
                        'content_name' => 'Captura Nobrk Express',
                        'content_category' => 'Lead',
                        'value' => (float)$valorLead, 
                        'currency' => 'BRL',
                        'desafio_tipo' => $desafioLegivel 
                    ],

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

            $metaResponse = curl_exec($ch);
            
            if (curl_errno($ch)) {
                error_log("META_CAPI_CURL_ERROR: " . curl_error($ch));
            } else {
                $statusData = json_decode($metaResponse, true);
                if (isset($statusData['error'])) {
                    error_log("META_CAPI_API_ERROR: " . json_encode($statusData['error']));
                }
            }

        } catch (\Exception $e) {
            error_log("META_CAPI_FATAL_ERROR: " . $e->getMessage());
        }
    }

    echo json_encode([
        'success' => true, 
        'message' => 'Lead capturado com sucesso!',
        'redirect' => '/obrigado',
        'dados_lead' => [
            'valor' => (float)$valorLead,
            'desafio' => $desafioLegivel
        ]
    ]);

} catch (Exception $e) {
    error_log("FATAL_ERROR: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro interno ao processar lead.']);
}