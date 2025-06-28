<?php

$uri = "mysql://avnadmin:AVNS_YG15ZpWmBU9m9AAZgju@mysql-3bcb1c69-lucasduarteoliveira1992-d4ed.d.aivencloud.com:13438/defaultdb?ssl-mode=REQUIRED";

$fields = parse_url($uri);

// build the DSN including SSL settings
$conn = "mysql:";
$conn .= "host=" . $fields["host"];
$conn .= ";port=" . $fields["port"];
$conn .= ";dbname=defaultdb";
$conn .= ";sslmode=verify-ca;sslrootcert=ca.pem";

try {
  $db = new PDO($conn, $fields["user"], $fields["pass"]);

  $stmt = $db->query("SELECT VERSION()");
  print($stmt->fetch()[0]);
} catch (Exception $e) {
  echo "Error: " . $e->getMessage();
}

// Show all information, defaults to INFO_ALL
//phpinfo();

?>

