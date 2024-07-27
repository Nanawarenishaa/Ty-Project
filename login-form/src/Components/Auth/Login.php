<?php
<?php
header('Access-Control-Allow-Origin: *'); // Allow all origins. For security, you may specify a specific origin instead of '*'.
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // Allow methods
header('Access-Control-Allow-Headers: Content-Type'); // Allow headers

// Database connection
$servername = "localhost";
$username = "root"; // Your MySQL username
$password = ""; // Your MySQL password
$dbname = "your_database_name"; // Your database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(['error' => 'Invalid input']);
    exit();
}

$username = $data['username'];
$password = $data['password'];

// Prepare and execute SQL query
$sql = "SELECT * FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['error' => 'User not found']);
    exit();
}

$user = $result->fetch_assoc();
$stmt->close();
$conn->close();

// Verify password
if (password_verify($password, $user['password_hash'])) {
    echo json_encode(['success' => 'Login successful']);
} else {
    echo json_encode(['error' => 'Invalid password']);
}
?>

$conn->close();
?>
