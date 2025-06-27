<?php include ("config/db_fsh.php")?>
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
        $meters = $user["meters"];

        $sql = 
        "UPDATE users SET meters = "
        .$meters." WHERE name = '".$name."';";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
    }
    else if (!empty($_GET["name"])) {
        $name = htmlspecialchars($_GET["name"]);

        $sql = "SELECT id, name, meters  
        FROM users WHERE name='".$name."';";

        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $rowCount = $stmt->rowCount();

        if ($rowCount == 0) {
            $meters = 0;

            $sql = "INSERT INTO users (
                name, 
                meters
             ) VALUES ('".
                $name."',".
                $meters.
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
        $sql = "SELECT id, name, meters  
        FROM users;";

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
