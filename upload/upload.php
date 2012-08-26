<?php

require_once 'power_mysql.php';
$power_mysql = new power_mysql();

//Get the data that we are uploading
$datestamp = $_GET['datestamp'];
$device_name = $_GET['device'];
$watts = $_GET['watts'];
$temp = $_GET['temp'];
$secID = $_GET['secID'];

//Authorise the data
$salt = 'salt'; // The salt that you have in your perl script
$myMD5 = md5($watts . $salt);

if ($secID == $myMD5) {

        //The client is authenticated, insert the data
        $queryresult = $power_mysql->insert_energy_data($datestamp, $watts, $temp, $device_name);
        echo("ok");
}
?>
