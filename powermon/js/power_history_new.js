/*
 *
 * Javascript to render graphs for power history
 *
 * James Sutton 2012
 *
 * james@jsutton.co.uk
 *
 */
$(function() {

	$.getScript("js/config.js", function(){

		config.runCallback(power_history_new);
	});

});

function power_history_new(devices) {

	var currentYear = Date.today().clearTime().toString("yyyy");
	var currentMonth = Date.today().clearTime().toString("MM");
	var currentDay = Date.today().clearTime().toString("dd");

	//URL
	var POWER_DATA_URL = "includes/get_power_data.php";
	
	/*
	 * Functions
	 */

	// Compare two series results on their name label (custom sort handler)
	function compare(a, b) {
		if (a.label < b.label) return -1;
		if (a.label > b.label) return 1;
		return 0;
	}

	function tempFormatter(v, axis) {
		return v.toFixed(axis.tickDecimals) +"°C";
	}

	function wattFormatter(v, axis) {
		return v.toFixed(axis.tickDecimals) + "W";
	}

	function showTooltip(x, y, contents) {
		$('<div id="tooltip">' + contents + '</div>').css({
			position : 'absolute',
			display : 'none',
			top : y + 5,
			left : x + 5,
			border : '1px solid #fdd',
			padding : '2px',
			'background-color' : '#fee',
			opacity : 0.80
		}).appendTo("body").fadeIn(200);
	}

	// Returns a range of years starting with 2012
	this.years = function(startYear) {
		var currentYear = new Date().getFullYear(), years = [];
		startYear = startYear || 2012;

		while ( startYear <= currentYear ) {
			years.push(startYear++);
		} 

		return years;
	};




	//	Years Clicked
	$("#years_div span").live('click', function(e) { 
		e.preventDefault; 
		this.blur(); 

		$('#years_div span').removeClass("selected");

		$( this ).addClass("selected");
		currentYear = $(this).attr('year');
		updateMonth(currentMonth);
		generateDays();
		return updateYear($(this).attr('year')); 
	});
	//	Months Clicked
	$("#months_div span").live('click', function(e) { 
		e.preventDefault; 
		this.blur(); 

		$('#months_div span').removeClass("selected");

		$( this ).addClass("selected");
		currentMonth = $(this).attr('month');
		generateDays();
		return updateMonth($(this).attr('month')); 
	});

	//	Days Clicked
	$("#days_div span").live('click', function(e){
		e.preventDefault; 
		this.blur(); 

		$('#days_div span').removeClass("selected");

		$( this ).addClass("selected");
		currentDay = $(this).attr('day');
		return updateDay($(this).attr('day'));
	});


	function updateDay(day){
		var startDate = currentYear + "-" + currentMonth + "-" + day;
		var endDate = Date.parse(startDate).add(1).days().toString("yyyy-MM-dd");

		//URL
		var dayTotalEnergyURL = POWER_DATA_URL + "?mode=watts&startDate=" + startDate + "%2000:00:00&endDate=" + endDate + "%2000:00:00&device=" + devices[0];

		var dayTotalEnergyOptions = {
				xaxis : {
					mode : 'time',
					min : (new Date(startDate)).getTime(),
					max : (new Date(endDate)).getTime()
				},
				yaxis : {
					tickFormatter : wattFormatter
				},
				legend : {
					show : true,
					margin : 10,
					backgroundOpacity : 0.5
				},
				series : {
					lines: { show: true, fill: true }
				},
				grid : {
					hoverable : true
				}
		};
		var dayTotalEnergyData = [];

		var dayTotalEnergyPlaceholder = $("#day_view");

		// fetch one series, adding to what we got
		var alreadyFetched = {};


		// then fetch the data with jQuery
		function onDataReceived_dayTotalEnergyPlot(series) {

			// extract the first coordinate pair so you can see that
			// data is now an ordinary Javascript object
			var firstcoordinate = '(' + series.data[0][0] + ', ' + series.data[0][1] + ')';

			// let's add it to our current data
			if (!alreadyFetched[series.label]) {
				alreadyFetched[series.label] = true;
				dayTotalEnergyData.push(series);
			}
			//debugger;

			// and plot all we got
			$.plot(dayTotalEnergyPlaceholder, dayTotalEnergyData, dayTotalEnergyOptions);
			//Now, for shits and giggles, lets do some maths!

		};

		var previousPoint = null;
		$("#day_view").bind("plothover", function(event, pos, item) {
			$("#x").text(pos.x.toFixed(2));
			$("#y").text(pos.y.toFixed(2));

			if(item) {
				if(previousPoint != item.dataIndex) {
					previousPoint = item.dataIndex;

					$("#tooltip").remove();
					var x = item.datapoint[0].toFixed(2), y = item.datapoint[1].toFixed(2);

					showTooltip(item.pageX, item.pageY, y + " watts");
				}
			} else {
				$("#tooltip").remove();
				previousPoint = null;
			}

		});

		$.plot(dayTotalEnergyPlaceholder, dayTotalEnergyData, dayTotalEnergyOptions);

		//Now lets do some temp stuff, much simpler *ahhhh*
		$.ajax({url : dayTotalEnergyURL,method : 'GET',dataType : 'json',success : onDataReceived_dayTotalEnergyPlot});
	}




	function updateMonth(month) {

		var monthStartDate = currentYear + "-" + month + "-01";
		var daysInMonth = Date.getDaysInMonth(currentYear, month -1);  
		var monthEndDate = currentYear + "-" + month + "-" + daysInMonth;


		//URL
		var monthTotalEnergyURL = POWER_DATA_URL + "?mode=watts&startDate=" + monthStartDate + "%2000:00:00&endDate=" + monthEndDate + "%2000:00:00&device=" + devices[0];

		var monthTotalEnergyOptions = {
				xaxis : {
					mode : 'time',
					min : (new Date(monthStartDate)).getTime(),
					max : (new Date(monthEndDate)).getTime()
				},
				yaxis : {
					tickFormatter : wattFormatter
				},
				legend : {
					show : true,
					margin : 10,
					backgroundOpacity : 0.5
				},
				series : {
					bars : {
						show : true,
						barWidth : 60 * 60 * 24 * 1000,
						align : 'center'
					}
				},
				grid : {
					hoverable : true
				}
		};



		var monthTotalEnergyData = [];


		var monthTotalEnergyPlaceholder = $("#month_view");

		// fetch one series, adding to what we got
		var monthAlreadyFetched = {};

		// then fetch the data with jQuery
		function onDataReceived_monthTotalEnergyOptions(series) {

			// extract the first coordinate pair so you can see that
			// data is now an ordinary Javascript object
			var firstcoordinate = '(' + series.data[0][0] + ', ' + series.data[0][1] + ')';

			// let's add it to our current data
			if(!monthAlreadyFetched[series.label]) {
				monthAlreadyFetched[series.label] = true;
				monthTotalEnergyData.push(series);
			}
			//debugger;

			// and plot all we got
			$.plot(monthTotalEnergyPlaceholder, monthTotalEnergyData, monthTotalEnergyOptions);
			//Now, for shits and giggles, lets do some maths!

		};

		var previousPoint = null;
		$("#month_view").bind("plothover", function(event, pos, item) {
			$("#x").text(pos.x.toFixed(2));
			$("#y").text(pos.y.toFixed(2));

			if(item) {
				if(previousPoint != item.dataIndex) {
					previousPoint = item.dataIndex;

					$("#tooltip").remove();
					var x = item.datapoint[0].toFixed(2), y = item.datapoint[1].toFixed(2);

					showTooltip(item.pageX, item.pageY, y + " watts");
				}
			} else {
				$("#tooltip").remove();
				previousPoint = null;
			}

		});

		$.plot(monthTotalEnergyPlaceholder, monthTotalEnergyData, monthTotalEnergyOptions);

		//Now lets do some temp stuff, much simpler *ahhhh*
		$.ajax({url : monthTotalEnergyURL,method : 'GET',dataType : 'json',success : onDataReceived_monthTotalEnergyOptions});
	}

	//	Updates the Year Graph
	function updateYear(year) {
		// First set the beggining and end dates
		/* Variables */

		var yearStartDate = year + "-01-01";
		var yearEndDate = year + "-12-31";
		//URL
		var yearTotalEnergyURL = POWER_DATA_URL + "?mode=watts&startDate=" + yearStartDate + "%2000:00:00&endDate=" + yearEndDate + "%2000:00:00&device=" + devices[0];
		console.log(yearTotalEnergyURL);

		var yearTotalEnergyOptions = {
				xaxis : {
					mode : 'time',
					min : (new Date(yearStartDate)).getTime(),
					max : (new Date(yearEndDate)).getTime()
				},
				yaxis : {
					tickFormatter : wattFormatter
				},
				legend : {
					show : true,
					margin : 10,
					backgroundOpacity : 0.5
				},
				series : {
					lines: { show: true, fill: true }
				},
				grid : {
					hoverable : true
				}
		};

		var yearTotalEnergyData = [];

		var yearTotalEnergyPlaceholder = $("#year_view");

		// fetch one series, adding to what we got
		var yearAlreadyFetched = {};

		// then fetch the data with jQuery
		function onDataReceived_yearTotalEnergyOptions(series) {

			// extract the first coordinate pair so you can see that
			// data is now an ordinary Javascript object
			var firstcoordinate = '(' + series.data[0][0] + ', ' + series.data[0][1] + ')';

			// let's add it to our current data
			if(!yearAlreadyFetched[series.label]) {
				yearAlreadyFetched[series.label] = true;
				yearTotalEnergyData.push(series);
			}
			//debugger;

			// and plot all we got
			$.plot(yearTotalEnergyPlaceholder, yearTotalEnergyData, yearTotalEnergyOptions);

			//Now, for shits and giggles, lets do some maths!

		};

		var previousPoint = null;
		$("#year_view").bind("plothover", function(event, pos, item) {
			$("#x").text(pos.x.toFixed(2));
			$("#y").text(pos.y.toFixed(2));

			if(item) {
				if(previousPoint != item.dataIndex) {
					previousPoint = item.dataIndex;

					$("#tooltip").remove();
					var x = item.datapoint[0].toFixed(2), y = item.datapoint[1].toFixed(2);

					showTooltip(item.pageX, item.pageY, y + " watts");
				}
			} else {
				$("#tooltip").remove();
				previousPoint = null;
			}

		});

		$.plot(yearTotalEnergyPlaceholder, yearTotalEnergyData, yearTotalEnergyOptions);

		//Now lets do some temp stuff, much simpler *ahhhh*
		$.ajax({url : yearTotalEnergyURL,method : 'GET',dataType : 'json',success : onDataReceived_yearTotalEnergyOptions});

	}


	function generateDays(){

		var days = [];
		var daysInMonth = Date.getDaysInMonth(currentYear, currentMonth -1);  
		var monthEndDate = currentYear + "-" + currentMonth + "-" + daysInMonth;

		for (i=0; i < daysInMonth; i++)
		{
			days.push(i + 1);
		}

		var myDays = days;
		var day_text = "<center><h3>";

		for (i=0; i < myDays.length;  i++){
			day_text +="<span day=\""+("0" + myDays[i]).slice(-2)+"\">"+myDays[i]+"</span>&nbsp;&nbsp;";
		}
		day_text +="</h3></center>";
		document.getElementById("days_div").innerHTML=day_text;
	}


	/*
	 * 
	 * Main Code Here
	 * 
	 */

	//	Generate the Years Bar

	var myYears = this.years();
	//create variable to hold the text generated by the for loop
	var year_text = "<center><h2>";

	for(var i=0; i<myYears.length; i++){
		year_text +="<span year=\""+myYears[i]+"\">"+myYears[i]+"</span>&nbsp;&nbsp;";
	}
	year_text +="</h2></center>";

	document.getElementById("years_div").innerHTML=year_text;


	generateDays();
	//Start with current year:
	updateYear(currentYear);
	$('span[year=' + currentYear + ']').addClass("selected");

	//Start with current month:
	updateMonth(currentMonth);
	$('span[month=' + currentMonth + ']').addClass("selected");

	//Start with current Day
	updateDay(currentDay);
	$('span[day=' + currentDay + ']').addClass("selected");
}
