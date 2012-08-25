<?php
/*
 * 
 * Script to take a day in yyyy-mm-dd format and return the total cost of energy for that day
 * 
 * jsutton.co.uk - 2012
 * 
 */


//Connect To Database
require_once ($_SERVER['DOCUMENT_ROOT'] . "/includes/constants.php");
$conn = new mysqli(POWERMON_DB_SERVER, POWERMON_DB_USER, POWERMON_DB_PASSWORD, POWERMON_DB_NAME) or 
					  die('There was a problem connecting to the database.');



//Get Arguments from Post
$date = $_GET['date'];

//Generate Query
$query = "  SELECT AVG(watts), HOUR(datetime)
  FROM power_data    
  WHERE DATE_SUB(`datetime`,INTERVAL 1 HOUR) AND DATE(datetime) = DATE('$date') GROUP BY HOUR(datetime)
";

// Get Result
if($result = $conn->query($query)){	

	$total = 0;
	
	/* fetch associative array */
	while($row = $result->fetch_assoc()){
	$total = $total +  $row['AVG(watts)'];
	}
	
	//Calculate the Price of the day (so far if current day)
	$wattTotal = $total / 24;
	$KwHours = $wattTotal / 100;
	$pencePerKw = 0.1206;
	$pricePerDay = ($KwHours * $pencePerKw) + 0.1773;
	
	//Print Rounded up cost
	print round($pricePerDay, 2);
}

?>