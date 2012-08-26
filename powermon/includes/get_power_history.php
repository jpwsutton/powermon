<?php

//Connect To Database
require_once ($_SERVER['DOCUMENT_ROOT'] . "/includes/constants.inc");
$conn = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME) or 
					  die('There was a problem connecting to the database.');
					  
					  
date_default_timezone_set('UTC');

//Get Arguments from Post
$mode = $_GET['mode'];

// We are getting watt data
if( $mode == "watts"){
	$startDate = $_GET['startDate'];
	$endDate = $_GET['endDate'];
	$device = $_GET['device'];

	$query = "SELECT watts, datetime FROM power_data_dayaverage WHERE datetime BETWEEN '$startDate' AND '$endDate' AND device = '$device' ORDER BY datetime";
	#print("QUERY: $query</br>");

	if($result = $conn->query($query)){

		print("{\n");
		print("\"label\": \"$device (Watts)\", \"yaxis\": 1,\n");
		print("\"data\": ");
		print("[");
		$i = 0;
		
	    /* determine number of rows result set */
	    $row_cnt = $result->num_rows;
		if($row_cnt == 0){
			print("[0,0]");
		}
			/* fetch associative array */
			while($row = $result->fetch_assoc()){
				
				if ($i != 0){
				print(",");
			}
			print ("[");
			// Evaluates to true because $var is empty
			
			$timeBefore = strtotime($row['datetime']);
			print($timeBefore * 1000);
			
			print (",");
			
			print($row['watts']);
			
			print("]");
			$i = 1;
			}
		print("]}\n");
	
		$result->free();
		}
	
}
elseif ($mode == "temp"){
	$startDate = $_GET['startDate'];
	$endDate = $_GET['endDate'];
	$device = $_GET['device'];
		
	$query = "SELECT temp, datetime FROM power_data_dayaverage WHERE datetime BETWEEN '$startDate' AND '$endDate' AND device = '$device' ORDER BY datetime";
	#print("QUERY: $query</br>");
	if($result = $conn->query($query)){
		print("{\n");
		print("\"label\": \"$device (Temp)\", \"yaxis\": 1,\n");
		print("\"data\": ");
		print("[");
		$i = 0;
		/* determine number of rows result set */
	    $row_cnt = $result->num_rows;
		if($row_cnt == 0){
			print("[0,0]");
		}
			/* fetch associative array */
			while($row = $result->fetch_assoc()){
				if ($i != 0){
				 print(",");
			 }
			 print ("[");
			 
			 $timeBefore = strtotime($row['datetime']);
			 print($timeBefore * 1000);
			 print (",");
			 print($row['temp']);
			 print("]");
			$i = 1;
			}
		print("]}\n");
	
		$result->free();
		}

}

mysqli_close($conn); 


?>
