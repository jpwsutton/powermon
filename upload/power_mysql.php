<?php
// Define constants here
define('DB_SERVER', 'localhost');
define('DB_USER', 'www');
define('DB_PASSWORD', 'password');
define('DB_NAME', 'power_data');

class power_mysql {
    private $conn;

    function __construct() {
        $this->conn = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME) or
                      die('There was a problem connecting to the database.');
    }

    function insert_energy_data($dateTime, $watts, $temp, $device) {

        $query = "INSERT INTO power_data_records(datetime, watts, temp, device)
                 values (?,?,?,?)";

        if($stmt = $this->conn->prepare($query)) {
            $stmt->bind_param('sids', $dateTime, $watts, $temp, $device);
            $stmt->execute();

            if($stmt->fetch()) {
                $stmt->close();
                return true;
            }
        }

    }

}

?>
