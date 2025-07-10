<?php include ("config/db_local.php")?>
<?php
//header("Content-Type: application/json; charset=utf-8");
$sql ="";
try {
    $remote_addr = $_SERVER["REMOTE_ADDR"];
    $forwarded =  $_SERVER["HTTP_X_FORWARDED_FOR"];

    if (!empty($_POST["action"]) && 
        $_POST["action"] == "delete-coin") {

        $coin = $_POST["coin"];

        $id = htmlspecialchars($coin["id"]);

        $sql = 
        "DELETE FROM coins WHERE id = ".$id.";";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();

        $x = -1000+rand(0, 2000);
        $y = -1000+rand(0, 2000);

        $sql = "INSERT INTO coins (
            x, 
            y 
         ) VALUES (".
            $x.",".
            $y.
         ");";

         $stmt = $pdo->prepare($sql);
         $stmt->execute();
    }
    else {
        $sql = "SELECT count(*) AS count ".
        "FROM coins;";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $details = $stmt->fetchAll(); 

        $coinLimit = 30;
        $diff = $coinLimit - $details[0]->count;

        for ($n = 0; $n < $diff; $n++) {
            $x = -1000+rand(0, 2000);
            $y = -1000+rand(0, 2000);

            $sql = "INSERT INTO coins (
                x, 
                y 
            ) VALUES (".
                $x.",".
                $y.
            ");";

            $stmt = $pdo->prepare($sql);
            $stmt->execute();
        }

        $sql = "SELECT id, x, y ".
        "FROM coins;";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $rowCount = $stmt->rowCount();
        $details = $stmt->fetchAll(); 

        echo json_encode($details);

        //echo $sql;
    }
}
catch (PDOException $e) {
   echo 'Connection failed: ' . $e->getMessage();
   echo $sql;
}
catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
    echo $sql;
}
?>
