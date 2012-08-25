<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<link rel="stylesheet" type="text/css" href="css/style.css" />
<link rel="stylesheet" type="text/css" href="css/menu.css" />
<link rel="stylesheet" type="text/css" href="css/jgauge.css"  />
<link rel="icon" type="image/png" href="images/favicon.png" />
<title>jsutton.co.uk | <?php print($page_title);?></title>
<?php
if(isset($page_javascripts)){
	foreach($page_javascripts as $script){
		print("<script type=\"text/javascript\" src=\"$script\"></script>\n");
	}
}
?>
</head>
<body>
<div id="content">
<div id="title_div">
<h1 class="title">
			<?php 
			print($page_title);
			if(isset($page_title_image))
			{
				print("<img src=\"$page_title_image\" class=\"title_image\" alt=\"Title Image\"/>");
			}
			?>
</h1>
</div>
<ul id="menu">
<li><a href="index.php">Home</a></li>
<li><a href="history.php">History</a></li>
<li><a href="history_new.php">New History</a></li>
<li><a href="statistics.php">Statistics</a></li>
</ul>
<br />
<br />
