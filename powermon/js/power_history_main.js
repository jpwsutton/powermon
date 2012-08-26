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

	//############################### WEEK DATA ###############################
	var start = new Date().getMilliseconds();

	/* Variables */
	var weekStartDate = Date.today().previous().monday().toString("yyyy-MM-dd");
//console.log(weekStartDate);
	var weekEndDate = Date.today().previous().monday().add(6).days().toString("yyyy-MM-dd");
//console.log(weekEndDate);
	//URL
	var POWER_HIST_URL = "includes/get_power_history.php";
	
	var weekTotalEnergyURL = POWER_HIST_URL + "?mode=watts&startDate=" 
							+ weekStartDate + "%2000:00:00&endDate=" 
							+ weekEndDate + "%2000:00:00&device=main";
	//console.log(weekTotalEnergyURL);
	// weekTotalEnergy Options

	var weekTotalEnergyOptions = {
		xaxis : {
			mode : 'time',
			min : (new Date(weekStartDate)).getTime(),
			max : (new Date(weekEndDate)).getTime()
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

	var weekTotalEnergyData = [];

	var weekTotalEnergyPlaceholder = $("#weekTotalEnergy");

	// fetch one series, adding to what we got
	var alreadyFetched = {};

	// then fetch the data with jQuery
	function onDataReceived_weendakTotalEnergyOptions(series) {

		// extract the first coordinate pair so you can see that
		// data is now an ordinary Javascript object
		var firstcoordinate = '(' + series.data[0][0] + ', ' + series.data[0][1] + ')';

		// let's add it to our current data
		if(!alreadyFetched[series.label]) {
			alreadyFetched[series.label] = true;
			weekTotalEnergyData.push(series);
		}
		//debugger;

		// and plot all we got
		$.plot(weekTotalEnergyPlaceholder, weekTotalEnergyData, weekTotalEnergyOptions);

		//Now, for shits and giggles, lets do some maths!

	};


	var previousPoint = null;
	$("#weekTotalEnergy").bind("plothover", function(event, pos, item) {
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
	/* Main */

	$.plot(weekTotalEnergyPlaceholder, weekTotalEnergyData, weekTotalEnergyOptions);

	//Now lets do some temp stuff, much simpler *ahhhh*
	$.ajax({url : weekTotalEnergyURL,method : 'GET',dataType : 'json',success : onDataReceived_weekTotalEnergyOptions});
	
	//############################### MONTH DATA ###############################
	/* Variables */
	var monthStartDate = Date.today().clearTime().moveToFirstDayOfMonth().toString("yyyy-MM-dd");
	var monthEndDate = Date.today().clearTime().moveToLastDayOfMonth().toString("yyyy-MM-dd");

	//URL
	var monthTotalEnergyURL = POWER_HIST_URL + "?mode=watts&startDate=" + monthStartDate + "%2000:00:00&endDate=" + monthEndDate + "%2000:00:00&device=main";
	//console.log(monthTotalEnergyURL);
	// weekTotalEnergy Options

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

	var monthTotalEnergyPlaceholder = $("#monthTotalEnergy");

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
	$("#monthTotalEnergy").bind("plothover", function(event, pos, item) {
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

	//############################### YEAR DATA ###############################
	/* Variables */
	var yearStartDate = Date.today().clearTime().toString("yyyy") + "-01-01";

	var yearEndDate = Date.today().clearTime().toString("yyyy") + "-12-31";

	//URL
	var yearTotalEnergyURL = POWER_HIST_URL + "?mode=watts&startDate=" + yearStartDate + "%2000:00:00&endDate=" + yearEndDate + "%2000:00:00&device=main";
	//console.log(yearTotalEnergyURL);
	// weekTotalEnergy Options

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

	var yearTotalEnergyPlaceholder = $("#yearTotalEnergy");

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
	$("#yearTotalEnergy").bind("plothover", function(event, pos, item) {
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


	
	// APPLIANCE DATA
	
	
	//############################### WEEK - APPLIANCE DATA ###############################
	
	//URL

	var weekApplianceEnergyURLs = [POWER_HIST_URL + "?mode=watts&startDate=" + weekStartDate + "%2000:00:00&endDate=" + weekEndDate + "%2000:00:00&device=james-pc",
	                               POWER_HIST_URL + "?mode=watts&startDate=" + weekStartDate + "%2000:00:00&endDate=" + weekEndDate + "%2000:00:00&device=james-other",
	                               POWER_HIST_URL + "?mode=watts&startDate=" + weekStartDate + "%2000:00:00&endDate=" + weekEndDate + "%2000:00:00&device=sam-pc"];

	var weekAppliancedone = 0;
	var weekAppliancecolourCount = 1;
	
	var weekApplianceEnergyOptions = {
		xaxis : {
			mode : 'time',
			min : (new Date(weekStartDate)).getTime(),
			max : (new Date(weekEndDate)).getTime()
		},
		yaxis : {
			tickFormatter : wattFormatter
		},
		legend : {
			show : true,
			margin : 10,
			backgroundOpacity : 0.5
		},
		 series: {
            lines: { show: true },
            points: { show: true }
        }
	};
	
	var weekApplianceEnergyData = [];
	

	var weekApplianceEnergyPlaceholder = $("#weekApplianceEnergy");

	// fetch one series, adding to what we got
	var weekAppliancealreadyFetched = {};
	
	// then fetch the data with jQuery
	function weekApplianceonDataReceived(series) {
		weekAppliancedone++;
		
		// extract the first coordinate pair so you can see that
		// data is now an ordinary Javascript object
		var firstcoordinate = '(' + series.data[0][0] + ', ' + series.data[0][1] + ')';
		
		// let's add it to our current data
		if (!weekAppliancealreadyFetched[series.label]) {
			weekAppliancealreadyFetched[series.label] = true;
			weekApplianceEnergyData.push(series);
		}
		
		if(weekAppliancedone >= weekApplianceEnergyURLs.length) {
			
			weekApplianceEnergyData.sort(compare);
			
			//Set Colours
			$.each(weekApplianceEnergyData, function (key, val) {
				val.color = weekAppliancecolourCount;
				++weekAppliancecolourCount;
		  	});
				
			// and plot all we got
			$.plot(weekApplianceEnergyPlaceholder, weekApplianceEnergyData, weekApplianceEnergyOptions);
		}
	};

	$.plot(weekApplianceEnergyPlaceholder, weekApplianceEnergyData, weekApplianceEnergyOptions);


	for ( wattURL in weekApplianceEnergyURLs ) {


		$.ajax({url: weekApplianceEnergyURLs[wattURL], method: 'GET', dataType: 'json', success: weekApplianceonDataReceived });

	}	
	
	//############################### month - APPLIANCE DATA ###############################
	
	
	//URL

	var monthApplianceEnergyURLs = [POWER_HIST_URL + "?mode=watts&startDate=" + monthStartDate + "%2000:00:00&endDate=" + monthEndDate + "%2000:00:00&device=james-pc",
	                                POWER_HIST_URL + "?mode=watts&startDate=" + monthStartDate + "%2000:00:00&endDate=" + monthEndDate + "%2000:00:00&device=james-other",
	                                POWER_HIST_URL + "?mode=watts&startDate=" + monthStartDate + "%2000:00:00&endDate=" + monthEndDate + "%2000:00:00&device=sam-pc"];

	var monthAppliancedone = 0;
	var monthAppliancecolourCount = 1;
	
	var monthApplianceEnergyOptions = {
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
		 series: {
            lines: { show: true },
            points: { show: true }
        }
	};
	
	var monthApplianceEnergyData = [];
	

	var monthApplianceEnergyPlaceholder = $("#monthApplianceEnergy");

	// fetch one series, adding to what we got
	var monthAppliancealreadyFetched = {};
	
	// then fetch the data with jQuery
	function monthApplianceonDataReceived(series) {
		monthAppliancedone++;
		
		// extract the first coordinate pair so you can see that
		// data is now an ordinary Javascript object
		var firstcoordinate = '(' + series.data[0][0] + ', ' + series.data[0][1] + ')';
		
		// let's add it to our current data
		if (!monthAppliancealreadyFetched[series.label]) {
			monthAppliancealreadyFetched[series.label] = true;
			monthApplianceEnergyData.push(series);
		}
		
		if(monthAppliancedone >= monthApplianceEnergyURLs.length) {
			
			monthApplianceEnergyData.sort(compare);
			
			//Set Colours
			$.each(monthApplianceEnergyData, function (key, val) {
				val.color = monthAppliancecolourCount;
				++monthAppliancecolourCount;
		  	});
				
			// and plot all we got
			$.plot(monthApplianceEnergyPlaceholder, monthApplianceEnergyData, monthApplianceEnergyOptions);
		}
	};

	$.plot(monthApplianceEnergyPlaceholder, monthApplianceEnergyData, monthApplianceEnergyOptions);


	for ( wattURL in monthApplianceEnergyURLs ) {


		$.ajax({url: monthApplianceEnergyURLs[wattURL], method: 'GET', dataType: 'json', success: monthApplianceonDataReceived });

	}	
	
	
	//############################### year - APPLIANCE DATA ###############################
	
	
	//URL

	var yearApplianceEnergyURLs = [POWER_HIST_URL + "?mode=watts&startDate=" + yearStartDate + "%2000:00:00&endDate=" + yearEndDate + "%2000:00:00&device=james-pc",
	                               POWER_HIST_URL + "?mode=watts&startDate=" + yearStartDate + "%2000:00:00&endDate=" + yearEndDate + "%2000:00:00&device=james-other",
	                               POWER_HIST_URL + "?mode=watts&startDate=" + yearStartDate + "%2000:00:00&endDate=" + yearEndDate + "%2000:00:00&device=sam-pc"];

	var yearAppliancedone = 0;
	var yearAppliancecolourCount = 1;
	
	var yearApplianceEnergyOptions = {
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
		 series: {
            lines: { show: true },
            points: { show: false }
        }
	};
	
	var yearApplianceEnergyData = [];
	

	var yearApplianceEnergyPlaceholder = $("#yearApplianceEnergy");

	// fetch one series, adding to what we got
	var yearAppliancealreadyFetched = {};
	
	// then fetch the data with jQuery
	function yearApplianceonDataReceived(series) {
		yearAppliancedone++;
		
		// extract the first coordinate pair so you can see that
		// data is now an ordinary Javascript object
		var firstcoordinate = '(' + series.data[0][0] + ', ' + series.data[0][1] + ')';
		
		// let's add it to our current data
		if (!yearAppliancealreadyFetched[series.label]) {
			yearAppliancealreadyFetched[series.label] = true;
			yearApplianceEnergyData.push(series);
		}
		
		if(yearAppliancedone >= yearApplianceEnergyURLs.length) {
			
			yearApplianceEnergyData.sort(compare);
			
			//Set Colours
			$.each(yearApplianceEnergyData, function (key, val) {
				val.color = yearAppliancecolourCount;
				++yearAppliancecolourCount;
		  	});
				
			// and plot all we got
			$.plot(yearApplianceEnergyPlaceholder, yearApplianceEnergyData, yearApplianceEnergyOptions);
		}
	};

	$.plot(yearApplianceEnergyPlaceholder, yearApplianceEnergyData, yearApplianceEnergyOptions);


	for ( wattURL in yearApplianceEnergyURLs ) {


		$.ajax({url: yearApplianceEnergyURLs[wattURL], method: 'GET', dataType: 'json', success: yearApplianceonDataReceived });

	}	


// TEMPERATURE DATA


	//############################### WEEK - temp DATA ###############################
	
	//URL

	var weektempURLs = [POWER_HIST_URL + "?mode=temp&startDate=" + weekStartDate + "%2000:00:00&endDate=" + weekEndDate + "%2000:00:00&device=main"];

	var weektempdone = 0;
	var weektempcolourCount = 4;
	
	var weektempOptions = {
		xaxis : {
			mode : 'time',
			min : (new Date(weekStartDate)).getTime(),
			max : (new Date(weekEndDate)).getTime()
		},
		yaxis : {
			tickFormatter : tempFormatter
		},
		legend : {
			show : true,
			margin : 10,
			backgroundOpacity : 0.5
		},
		 series: {
            lines: { show: true, fill: true },
            points: { show: true }
        }
	};
	
	var weektempData = [];
	

	var weektempPlaceholder = $("#weektemp");

	// fetch one series, adding to what we got
	var weektempalreadyFetched = {};
	
	// then fetch the data with jQuery
	function weektemponDataReceived(series) {
		weektempdone++;
		
		// extract the first coordinate pair so you can see that
		// data is now an ordinary Javascript object
		var firstcoordinate = '(' + series.data[0][0] + ', ' + series.data[0][1] + ')';
		
		// let's add it to our current data
		if (!weektempalreadyFetched[series.label]) {
			weektempalreadyFetched[series.label] = true;
			weektempData.push(series);
		}
		
		if(weektempdone >= weektempURLs.length) {
			
			weektempData.sort(compare);
			
			//Set Colours
			$.each(weektempData, function (key, val) {
				val.color = weektempcolourCount;
				++weektempcolourCount;
		  	});
		
			// and plot all we got
			$.plot(weektempPlaceholder, weektempData, weektempOptions);
		}
	};
		

	$.plot(weektempPlaceholder, weektempData, weektempOptions);


	for ( tempURL in weektempURLs ) {


		$.ajax({url: weektempURLs[tempURL], method: 'GET', dataType: 'json', success: weektemponDataReceived });

	}	
	
		//############################### month - temp DATA ###############################


	//URL

	var monthtempURLs = [POWER_HIST_URL + "?mode=temp&startDate=" + monthStartDate + "%2000:00:00&endDate=" + monthEndDate + "%2000:00:00&device=main"];

	var monthtempdone = 0;
	var monthtempcolourCount = 4;
	
	var monthtempOptions = {
		xaxis : {
			mode : 'time',
			min : (new Date(monthStartDate)).getTime(),
			max : (new Date(monthEndDate)).getTime()
		},
		yaxis : {
			tickFormatter : tempFormatter
		},
		legend : {
			show : true,
			margin : 10,
			backgroundOpacity : 0.5
		},
		 series: {
            lines: { show: true, fill: true },
            points: { show: false }
        }
	};
	
	var monthtempData = [];
	

	var monthtempPlaceholder = $("#monthtemp");

	// fetch one series, adding to what we got
	var monthtempalreadyFetched = {};
	
	// then fetch the data with jQuery
	function monthtemponDataReceived(series) {
		monthtempdone++;
		
		// extract the first coordinate pair so you can see that
		// data is now an ordinary Javascript object
		var firstcoordinate = '(' + series.data[0][0] + ', ' + series.data[0][1] + ')';
		
		// let's add it to our current data
		if (!monthtempalreadyFetched[series.label]) {
			monthtempalreadyFetched[series.label] = true;
			monthtempData.push(series);
		}
		
		if(monthtempdone >= monthtempURLs.length) {
			
			monthtempData.sort(compare);
			
			//Set Colours
			$.each(monthtempData, function (key, val) {
				val.color = monthtempcolourCount;
				++monthtempcolourCount;
		  	});
				
			// and plot all we got
			$.plot(monthtempPlaceholder, monthtempData, monthtempOptions);
		}
	};

	$.plot(monthtempPlaceholder, monthtempData, monthtempOptions);


	for ( tempURL in monthtempURLs ) {


		$.ajax({url: monthtempURLs[tempURL], method: 'GET', dataType: 'json', success: monthtemponDataReceived });

	}	
	
	
	//############################### year - temp DATA ###############################
	

	//URL

	var yeartempURLs = [POWER_HIST_URL + "?mode=temp&startDate=" + yearStartDate + "%2000:00:00&endDate=" + yearEndDate + "%2000:00:00&device=main"];

	var yeartempdone = 0;
	var yeartempcolourCount = 4;
	
	var yeartempOptions = {
		xaxis : {
			mode : 'time',
			min : (new Date(yearStartDate)).getTime(),
			max : (new Date(yearEndDate)).getTime()
		},
		yaxis : {
			tickFormatter : tempFormatter
		},
		legend : {
			show : true,
			margin : 10,
			backgroundOpacity : 0.5
		},
		 series: {
            lines: { show: true, fill: true },
            points: { show: false }
        }
	};
	
	var yeartempData = [];
	

	var yeartempPlaceholder = $("#yeartemp");

	// fetch one series, adding to what we got
	var yeartempalreadyFetched = {};
	
	// then fetch the data with jQuery
	function yeartemponDataReceived(series) {
		yeartempdone++;
		
		// extract the first coordinate pair so you can see that
		// data is now an ordinary Javascript object
		var firstcoordinate = '(' + series.data[0][0] + ', ' + series.data[0][1] + ')';
		
		// let's add it to our current data
		if (!yeartempalreadyFetched[series.label]) {
			yeartempalreadyFetched[series.label] = true;
			yeartempData.push(series);
		}
		
		if(yeartempdone >= yeartempURLs.length) {
			
			yeartempData.sort(compare);
			
			//Set Colours
			$.each(yeartempData, function (key, val) {
				val.color = yeartempcolourCount;
				++yeartempcolourCount;
		  	});
				
			// and plot all we got
			$.plot(yeartempPlaceholder, yeartempData, yeartempOptions);
		}
	};

	$.plot(yeartempPlaceholder, yeartempData, yeartempOptions);


	for ( tempURL in yeartempURLs ) {


		$.ajax({url: yeartempURLs[tempURL], method: 'GET', dataType: 'json', success: yeartemponDataReceived });

	}


	var stop = new Date().getMilliseconds();

	var executionTime = stop - start;

	console.log("power_history_main.js executed in " + executionTime + " milliseconds");	

});
