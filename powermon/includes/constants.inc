<?php
/*
 * This php document reads in a configuration file, and defines
 *  important constants that are used in powermon
 */

// Parse configuration with sections
$config = parse_ini_file("../config/powerConfig.conf", true);

// MYSQL Server Connection Variables
define('DB_SERVER', $config["database"]["db_server"]);
define('DB_USER', $config["database"]["db_user"]);
define('DB_PASSWORD', $config["database"]["db_password"]);
define('DB_NAME', $config["database"]["db_name"]);

//API specific Settings
define('API_UPLOAD_SALT', $config["web-api"]["api_salt"]);

?>