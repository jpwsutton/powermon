<?php
//Page specific variables
$page_title = 'PowerMon - History';
$page_title_image = 'images/title_image.png';
$page_javascripts[0] = "js/flot/jquery.min.js";
$page_javascripts[1] = "js/flot/jquery.flot.min.js";
$page_javascripts[2] = "js/power_history_main.js";
$page_javascripts[3] = "js/date.js";
include 'includes/header.inc';

?>

	<h1>Historical Data</h1>
	<br />
	<h2>This Week</h2>
	<br />
	<h3>Total Energy Usage</h3>
	<div id="weekTotalEnergy" class="center" style="width:600px;height:300px;"></div>
	<br />
	<h3>Appliance Energy Usage</h3>
	<div id="weekApplianceEnergy" class="center" style="width:600px;height:300px;"></div>
	<br />
	<h3>Temperature</h3>
	<div id="weektemp" class="center" style="width:600px;height:300px;"></div>
	<br />
	<h2>This Month</h2>
	<br />
	<h3>Total Energy Usage</h3>
	<div id="monthTotalEnergy" class="center" style="width:600px;height:300px;"></div>
	<br />
	<h3>Appliance Energy Usage</h3>
	<div id="monthApplianceEnergy" class="center" style="width:600px;height:300px;"></div>
	<br />
	<h3>Temperature</h3>
	<div id="monthtemp" class="center" style="width:600px;height:300px;"></div>
	<br />
	<h2>This Year</h2>
    <br />
	<h3>Total Energy Usage</h3>
	<div id="yearTotalEnergy" class="center" style="width:600px;height:300px;"></div>
	<br />
	<h3>Appliance Energy Usage</h3>
	<div id="yearApplianceEnergy" class="center" style="width:600px;height:300px;"></div>
	<br />
	<h3>Temperature</h3>
	<div id="yeartemp" class="center" style="width:600px;height:300px;"></div>
	<br />
<?php
include 'includes/footer.inc';
?>

