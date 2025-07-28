<?php
// === DEV ERROR REPORTING ===
error_reporting(E_ALL);
ini_set('display_errors', 1);

// === CORS HANDLING ===
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: GET, OPTIONS");
    http_response_code(204);
    exit;
}

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../session.php';
require_once __DIR__ . '/../db.php';

// === DB HELPERS ===
function getParamTypes($params) {
    $types = '';
    foreach ($params as $p) {
        $types .= is_int($p) ? 'i' : (is_float($p) ? 'd' : 's');
    }
    return $types;
}

function fetchOne($conn, $query, $params = []) {
    $stmt = $conn->prepare($query);
    if ($params) $stmt->bind_param(getParamTypes($params), ...$params);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $result;
}

function fetchAll($conn, $query, $params = []) {
    $stmt = $conn->prepare($query);
    if ($params) $stmt->bind_param(getParamTypes($params), ...$params);
    $stmt->execute();
    $result = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    return $result;
}

// === MAIN LOGIC ===
try {
    $user = authenticate(); // 👈 Now user object from token directly

    // 📊 Group Stats
    $groupStats = fetchOne($conn, "SELECT total_savings, total_members, active_members, interest_rate FROM group_stats LIMIT 1") 
        ?? ['total_savings' => 0, 'total_members' => 0, 'active_members' => 0, 'interest_rate' => 0];

    // 👥 Members
    $members = fetchAll($conn, "SELECT id, name, avatar FROM members LIMIT 10");

    // 💰 Contributions
    $contributions = fetchAll($conn, "
        SELECT c.id, m.name AS member, c.amount, c.date 
        FROM contributions c 
        JOIN members m ON c.member_id = m.id 
        ORDER BY c.date DESC 
        LIMIT 3
    ");

    // 🔄 Transactions
    $transactions = fetchAll($conn, "
        SELECT t.id, t.type, m.name AS member, t.amount, t.date 
        FROM transactions t 
        JOIN members m ON t.member_id = m.id 
        ORDER BY t.date DESC 
        LIMIT 3
    ");

    // 🔔 Notifications
    $notifications = fetchAll($conn, "
        SELECT id, text, created_at 
        FROM notifications 
        ORDER BY created_at DESC 
        LIMIT 3
    ");

    // 💬 Chats
    $chats = fetchAll($conn, "
        SELECT id, name, preview, unread 
        FROM chats 
        ORDER BY id DESC 
        LIMIT 3
    ");

    // 🏧 Withdrawal Requests
    $withdrawalRequests = fetchAll($conn, "
        SELECT w.id, m.name AS member, w.amount, w.date, w.status 
        FROM withdrawal_requests w 
        JOIN members m ON w.member_id = m.id 
        ORDER BY w.date DESC 
        LIMIT 3
    ");

    // 📊 Chart Data
    $barData = [
        "labels" => ["January", "February", "March", "April"],
        "datasets" => [[
            "label" => "Monthly Savings",
            "data" => [1000, 1500, 1200, 1800],
            "backgroundColor" => "#36A2EB"
        ]]
    ];

    $lineData = [
        "labels" => ["January", "February", "March", "April"],
        "datasets" => [[
            "label" => "Loan Repayments",
            "data" => [300, 400, 600, 500],
            "borderColor" => "#FF6384",
            "fill" => false
        ]]
    ];

    $pieData = [
        "labels" => ["Deposits", "Withdrawals"],
        "datasets" => [[
            "data" => [4000, 1500],
            "backgroundColor" => ["#4BC0C0", "#FF6384"]
        ]]
    ];

    echo json_encode([
        "status" => "success",
        "data" => [
            "user" => $user,
            "group_stats" => $groupStats,
            "members" => $members,
            "contributions" => $contributions,
            "transactions" => $transactions,
            "notifications" => $notifications,
            "chats" => $chats,
            "withdrawal_requests" => $withdrawalRequests,
            "bar_data" => $barData,
            "line_data" => $lineData,
            "pie_data" => $pieData
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
} finally {
    if (isset($conn)) $conn->close();
}
