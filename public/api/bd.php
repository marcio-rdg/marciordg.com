<?php

require_once __DIR__ . '/../../vendor/autoload.php';

use Dotenv\Dotenv;

class Database {
    private static $instance = null;
    private $conn;

    private function __construct() {
        try {
            $dotenv = Dotenv::createImmutable(__DIR__ . '/../../');
            $dotenv->load();

            $dsn = sprintf(
                "mysql:host=%s;dbname=%s;charset=%s",
                $_ENV['DB_HOST'] ?? 'localhost',
                $_ENV['DB_NAME'] ?? '',
                $_ENV['DB_CHARSET'] ?? 'utf8mb4'
            );

            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, 
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       
                PDO::ATTR_EMULATE_PREPARES   => false,                 
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"     
            ];

            $this->conn = new PDO(
                $dsn, 
                $_ENV['DB_USER'] ?? '', 
                $_ENV['DB_PASS'] ?? '', 
                $options
            );

        } catch (\Exception $e) {
    exit;
}
    }

    public static function getConnection() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance->conn;
    }

    private function __clone() {}
    public function __wakeup() {
        throw new \Exception("Cannot unserialize a singleton.");
    }
}