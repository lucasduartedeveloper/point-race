<?php include ("config/db_local.php")?>
<?php
//header("Content-Type: application/json; charset=utf-8");
$sql ="";
try {
    $remote_addr = $_SERVER["REMOTE_ADDR"];
    $forwarded =  $_SERVER["HTTP_X_FORWARDED_FOR"];

    if (!empty($_POST["action"]) && 
        $_POST["action"] == "update-user") {

        $user = $_POST["user"];

        $id = htmlspecialchars($user["id"]);
        $name = 
        htmlspecialchars($user["name"]);
        $x = $user["x"];
        $y = $user["y"];
        $angle = $user["angle"];

        $sql = 
        "UPDATE users_2d SET x = "
        .$x.", y = ".$y.", angle = ".$angle.
        " WHERE name = '".$name."';";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    }
    else if (!empty($_GET["name"])) {
        $name = htmlspecialchars($_GET["name"]);

        $sql = "SELECT id, name, x, y, angle 
        FROM users_2d WHERE name='".$name."';";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $rowCount = $stmt->rowCount();

        if ($rowCount == 0) {
            $x = 0;
            $y = 0;
            $angle = 0;

            $sql = "INSERT INTO users_2d (
                name,
                x,
                y,
                angle
             ) VALUES ('".
                $name."',".
                $x.",".
                $y.",".
                $angle.
             ");";

             $stmt = $pdo->prepare($sql);
             $stmt->execute();

             $arr = [
                 array('id' => 1, 'name' => $name, 
             'meters' => 0)
             ];

             echo json_encode($arr);
        }
        else {
            $details = $stmt->fetchAll(); 
            echo json_encode($details);
        }

        //echo $sql;
    }
    else {
        $sql = "SELECT id, name, x, y, angle 
        FROM users_2d;";

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
