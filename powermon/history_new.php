<?php
//Page specific variables
$page_title = 'PowerMon - New History';
$page_title_image = 'images/title_image.png';
$page_javascripts[0] = "js/flot/jquery.min.js";
$page_javascripts[1] = "js/flot/jquery.flot.min.js";
$page_javascripts[2] = "js/power_history_new.js";
$page_javascripts[3] = "js/date.js";
include 'includes/header.inc';
?>
<div id="box_div">
	<div id="years_div" style="height:40px;">
	</div>
</div>

<div id="box_div">
	<div id="month_div">
		<div id="year_view" class="center" style="width:900px;height:125px;"></div>
	</div>
</div>

<div id="box_div">
	<div id="months_div" style="height:40px;">
		<center><h3>
		<span month="01">January</span>&nbsp;&nbsp;
		<span month="02">February</span>&nbsp;&nbsp;
		<span month="03">March</span>&nbsp;&nbsp;
		<span month="04">April</span>&nbsp;&nbsp;
		<span month="05">May</span>&nbsp;&nbsp;
		<span month="06">June</span>&nbsp;&nbsp;
		<span month="07">July</span>&nbsp;&nbsp;
		<span month="08">August</span>&nbsp;&nbsp;
		<span month="09">September</span>&nbsp;&nbsp;
		<span month="10">October</span>&nbsp;&nbsp;
		<span month="11">November</span>&nbsp;&nbsp;
		<span month="12">December</span>&nbsp;&nbsp;
		</h3></center>
	</div>
</div>

<div id="box_div">
	<div id="month_div">
		<div id="month_view" class="center" style="width:900px;height:350px;"></div>
	</div>
</div>

<div id="box_div">
	<div id="days_div" style="height:40px;">
	</div>
</div>

<div id="box_div">
	<div id="day_div">
		<div id="day_view" class="center" style="width:900px;height:350px;"></div>
	</div>
</div>
<?php
include 'includes/footer.inc';
?>
