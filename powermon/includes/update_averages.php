<?php

/*
 * Script to update Averages for power and temp data
 *
 * james@jsutton.co.uk 2012
 *
 */

//Connect to the Database
require_once ("constants.inc");
require_once ("sensors.inc");

$conn = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME) or 
					  die('There was a problem connecting to the database.');

date_default_timezone_set("Europe/London");
$date = date("Y-m-d", time() - (60*60*24) );

$s_obj = new Sensors();
$sensors = $s_obj->getSensors();

foreach($sensors as $device){
	echo $device;
	//Generate Query to update the average
	$query_update = "REPLACE INTO `power_data_dayaverage` (device, watts, temp, datetime)
					SELECT device, AVG(watts), AVG(temp), DATE(datetime)
					FROM `power_data_records`
					WHERE DATE_SUB(`datetime`,INTERVAL 1 DAY)
						AND DATE(`datetime`) = DATE(\"$date\")
						AND device = '$device'";

//	echo "<br />" . $query_update . "<br />";

	if($result = $conn->query($query_update)) {
		echo " - Success<br />";
	} else {
		echo " - Failure<br /> ";
		echo mysql_error();
	}
}










?>
