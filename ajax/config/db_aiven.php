<?php

// new db
$host = "mysql-3bcb1c69-lucasduarteoliveira1992-d4ed.d.aivencloud.com";
$user = "avnadmin";
$password = "AVNS_YG15ZpWmBU9m9AAZgju";
$dbname = "defaultdb";
$port = "13438";

try{

    //Set DSN data source name
    $dsn = "mysql:host=".$host.";port=".$port.";dbname=".$dbname.";sslmode=verify-ca;sslrootcert=ca.pem";

    //create a pdo instance
    $pdo = new PDO($dsn, $user, $password);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE,PDO::FETCH_OBJ);
    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES,false);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
catch (PDOException $e) {
   echo "Connection failed: " . $e->getMessage();
}
  ?>
