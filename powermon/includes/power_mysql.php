<?php
require_once ("constants.inc");

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
	
	function get_watts($day){
		$query = "SELECT watts, TIME(datetime) FROM power_data WHERE DATE(datetime) = DATE('$day')";
		
		if($result = $this->conn->query($query)){
			/* fetch associative array */
			while($rows[] = $result->fetch_assoc());
			
			$result->free();
			
		}
		$this->conn->close();
		return $rows;
	}
}


?>
