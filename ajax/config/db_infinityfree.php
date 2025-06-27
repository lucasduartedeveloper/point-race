<?php

// new db
$host = "sql107.infinityfree.com";
$user = "if0_39304929";
$password = "eeoKQRAQiiA";
$dbname = "if0_39304929_point_race";
$port = "3306";

try{

    //Set DSN data source name
    $dsn = "mysql:host=".$host.";port=".$port.";dbname=".$dbname;

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
