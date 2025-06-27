<?php

// new db
$host = "sql10.freesqldatabase.com";
$user = "sql10787210";
$password = "mu3dczpeu1";
$dbname = "sql10787210";
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
