/*
 * 
 * Javascript to render graphs for panda dashboard
 * 
 * James Sutton 2012
 * 
 * james@jsutton.co.uk
 * 
 */
$(function (){


	/* Variables */
	
	// Dates
	//var date = new Date();
	//var today = date.getFullYear() + "-" + ((date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)) + "-" + date.getDate();
	//date.setDate(date.getDate() + 1);
	//var tomorrow = date.getFullYear() + "-" + ((date.getMonth() < 9 ? '0' : '') + (date.getMonth() + 1)) + "-" + ((date.getDate() < 9 ? '0' : '') + (date.getDate() + 1));
	/* Variables */
	var today = Date.today().toString("yyyy-MM-dd");
	var tomorrow = Date.today().add(1).days().toString("yyyy-MM-dd");
	
	console.log(today);
	console.log(tomorrow);
	
	//Devices
	var devices=["main", "james-pc", "sam-pc", "james-other"];
	
	//URL
	var baseURL="includes/get_panda_data.php?";
	
	// Energy Options
	
	var wattOptions = {
			lines: { show: true },
			xaxis: {mode: 'time', min: (new Date(today)).getTime(), max: (new Date(tomorrow)).getTime()},
			yaxis: { tickFormatter: wattFormatter},
			legend: { show: true, margin: 10, backgroundOpacity: 0.5 }	
			};
	
	var wattData = [];
	
	var wattPlaceholder = $("#wattPlaceholder");
	
	
	// Temperature Options
	var tempOptions = {
			xaxis: {mode: 'time', min: (new Date(today)).getTime(), max: (new Date(tomorrow)).getTime()},
			yaxis: { tickFormatter: tempFormatter},
			legend: { show: true, margin: 10, backgroundOpacity: 0.5 }	
			};
			
	var tempData = [];
	
	var tempPlaceholder = $("#tempPlaceholder");

	var tempURL = "includes/get_panda_data.php?mode=temp&startDate=" + today + "%2000:00:00&endDate=" + tomorrow + "%2000:00:00&device=main";


	// fetch one series, adding to what we got
    var alreadyFetched = {};
	
    var urls = ["includes/get_panda_data.php?mode=watts&startDate=" + today + "%2000:00:00&endDate=" + tomorrow + "%2000:00:00&device=main",
    			"includes/get_panda_data.php?mode=watts&startDate=" + today + "%2000:00:00&endDate=" + tomorrow + "%2000:00:00&device=james-pc",
    			"includes/get_panda_data.php?mode=watts&startDate=" + today + "%2000:00:00&endDate=" + tomorrow + "%2000:00:00&device=james-other",
    			"includes/get_panda_data.php?mode=watts&startDate=" + today + "%2000:00:00&endDate=" + tomorrow + "%2000:00:00&device=sam-pc"];

	var done = 0;
	var colourCount = 0;
    var choiceContainer = $("#choices");
/* Functions */
     function tempFormatter(v, axis) {
        return v.toFixed(axis.tickDecimals) +"°C";
    }
    
    function wattFormatter(v, axis) {
    	return v.toFixed(axis.tickDecimals) +"W";
    }

    
	// then fetch the data with jQuery
	function onDataReceived(series) {
		done++;
		
		// extract the first coordinate pair so you can see that
		// data is now an ordinary Javascript object
		var firstcoordinate = '(' + series.data[0][0] + ', ' + series.data[0][1] + ')';
		
		// let's add it to our current data
		if (!alreadyFetched[series.label]) {
			alreadyFetched[series.label] = true;
			wattData.push(series);
		}
		
		if(done >= urls.length) {
			
			wattData.sort(compare);
			
			//Set Colours
			$.each(wattData, function (key, val) {
				val.color = colourCount;
				++colourCount;
		  	});
				// insert checkboxes 
    		var choiceContainer = $("#choices");
    		$.each(wattData, function(key, val) {
        		choiceContainer.append('<br/><input type="checkbox" name="' + key +
                	              '" checked="checked" id="id' + key + '">' +
                    	           '<label for="id' + key + '">'
                        	        + val.label + '</label>');
    		});
    				choiceContainer.find("input").click(plotAccordingToChoices);


			// and plot all we got
			$.plot(wattPlaceholder, wattData, wattOptions);
		}
	};
	 	




	// then fetch the data with jQuery
	function onDataReceived_temp(series) {
		
		// extract the first coordinate pair so you can see that
		// data is now an ordinary Javascript object
		var firstcoordinate = '(' + series.data[0][0] + ', ' + series.data[0][1] + ')';
		
		// let's add it to our current data
		if (!alreadyFetched[series.label]) {
			alreadyFetched[series.label] = true;
			tempData.push(series);
		}
		
		// and plot all we got
			$.plot(tempPlaceholder, tempData, tempOptions);
		
	};
	
	
	  function plotAccordingToChoices() {
        var data = [];

        choiceContainer.find("input:checked").each(function () {
            var key = $(this).attr("name");
            if (key && wattData[key])
                data.push(wattData[key]);
        });
	        if (data.length > 0)
            $.plot(wattPlaceholder, data, wattOptions);
    }
	
	// Compare two series results on their name label (custom sort handler)
	function compare(a, b) {
		if (a.label < b.label) return -1;
		if (a.label > b.label) return 1;
		return 0;
	}
	
	
/* Main */

	$.plot(wattPlaceholder, wattData, wattOptions);
	
	for ( wattURL in urls ) {
		$.ajax({url: urls[wattURL], method: 'GET', dataType: 'json', success: onDataReceived });

	}	
	
	
	
	//Now lets do some temp stuff, much simpler *ahhhh*
		$.ajax({url: tempURL, method: 'GET', dataType: 'json', success: onDataReceived_temp });

});

   

