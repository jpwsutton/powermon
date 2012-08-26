<?php
require_once ($_SERVER['DOCUMENT_ROOT'] . "/includes/constants.inc");
require_once 'power_mysql.php';

$power_mysql = new power_mysql();

//Get the data that we are uploading
$datestamp = $_GET['datestamp'];
$device_name = $_GET['device'];
$watts = $_GET['watts'];
$temp = $_GET['temp'];
$secID = $_GET['secID'];

//Authorise the data using the salt from constants.inc
$myMD5 = md5($watts . API_UPLOAD_SALT);

if ($secID == $myMD5) {

        //The client is authenticated, insert the data
        $queryresult = $power_mysql->insert_energy_data($datestamp, $watts, $temp, $device_name);
        echo("ok");
}
?>