<?php
//Page specific variables
$page_title = 'PowerMon';
$page_title_image = 'images/title_image.png';
$page_javascripts[0] = "js/flot/jquery.min.js";
$page_javascripts[1] = "js/flot/jquery.flot.min.js";
$page_javascripts[2] = "js/panda_new.js";
$page_javascripts[3] = "js/date.js";
include 'includes/header.php';

?>

<h1>Today's Power usage and Temperature</h1>
	<br />
	<h2>Energy Usage</h2>
	<div id="wattPlaceholder" class="center" style="width:800px;height:400px;"></div>
    <br />
    <p id="choices">Show:</p>
    <br />
	<h2>Temperature</h2>
    <div id="tempPlaceholder" class="center" style="width:800px;height:400px;"></div>
    <br />
    <br />
    <div id="liveusage" class="center">
    	<h2 class="center" >This Day has Cost <span id="cost"></span></h3>
    </div>
    
<?php
include 'includes/footer.php';
?>

