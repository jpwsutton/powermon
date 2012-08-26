<?php 

// Parse configuration with sections
$ini_array = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . "/reader/ccConfig.conf", true);

echo json_encode($ini_array);

?>