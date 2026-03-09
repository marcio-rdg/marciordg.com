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

$mapaDesafios = [
    'ctaOptionSiteLento'  => 'Otimização de Site (Lento)',
    'ctaOptionTracking'   => 'Tracking & Pixels',
    'ctaOptionNewProject' => 'Projeto Novo (Zero)',
];

$desafioLegivel = $mapaDesafios[$idBruto] ?? null;

$errors = [];
if (!$nome || strlen($nome) < 3) $errors[] = "Nome muito curto.";
if (!$email) $errors[] = "E-mail inválido.";
if (strlen($tel) < 10) $errors[] = "Telefone incompleto.";
if (!$desafioLegivel) $errors[] = "Opção de desafio inválida.";

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
        $mail->Subject = "🚀 Novo Lead: $nome";
        $mail->Body    = "
            <div style='font-family: sans-serif; line-height: 1.6;'>
                <h2>Nova oportunidade capturada!</h2>
                <p><strong>Nome:</strong> $nome</p>
                <p><strong>E-mail:</strong> $email</p>
                <p><strong>WhatsApp:</strong> <a href='https://wa.me/$tel'>$tel</a></p>
                <p><strong>Desafio:</strong> $desafioLegivel</p>
                <p style='color: #666; font-size: 12px;'>IP: {$_SERVER['REMOTE_ADDR']}</p>
            </div>
        ";

        $mail->send();
    } catch (Exception $e) {
        error_log("MAIL_ERROR: " . $mail->ErrorInfo);
    }

    echo json_encode([
        'success' => true, 
        'message' => 'Lead capturado e enviado com sucesso!',
        'redirect' => '/obrigado'
    ]);

} catch (Exception $e) {
    error_log("FATAL_ERROR: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erro interno ao processar lead.']);
}