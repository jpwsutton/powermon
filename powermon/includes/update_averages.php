<?php

/*
 * 
 * Script to update Averages for power and temp data
 * 
 * james@jsutton.co.uk 2012
 * 
 */

//Connect to the Database
//Connect To Database
require_once ($_SERVER['DOCUMENT_ROOT'] . "/includes/constants.inc");
$conn = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME) or 
					  die('There was a problem connecting to the database.');
					  
$date = date("Y-m-d", time() - (60*60*24) );

//Device query
$query_devices = "SELECT name FROM `power_devices`";


if($result = $conn->query($query_devices)){
	while($row = $result->fetch_assoc()){
		echo $row['name'];
		$device = $row['name'];
		//Generate Query to update the average
		$query_update = "REPLACE INTO
						`power_data_dayaverage`
						(device, watts, temp, datetime)
						SELECT
						device, AVG(watts), AVG(temp), DATE(datetime)
						FROM
						`power_data_records`
						WHERE
						DATE_SUB(`datetime`,INTERVAL 1 DAY) AND DATE(`datetime`) = DATE('$date') AND device = '$device'
						
						";
		if($result2 = $conn->query($query_update)){
			echo " - Success<br />";	
		}else{
			echo " - Failure<br />";
		}
	
	}	
}









?>