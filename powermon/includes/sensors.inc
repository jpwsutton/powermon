<?php 
/*
 * Lazy-load information on sensors
 */

class Sensors {
	
	private $location;
	
	public function __construct() {
		
		$this->location = $_SERVER['DOCUMENT_ROOT'] . "/reader/ccConfig.conf";
	}
	
	public function getSensors() {
		$s_arr = parse_ini_file($this->location, true);
		return $s_arr["sensors"];
	}
}





?>