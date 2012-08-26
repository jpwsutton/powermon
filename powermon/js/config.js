/*
 * config.js
 * 
 * Get configuration data for devices to plot from the back-end
 * 
 * Usage (using jQuery):
 * 
 * $.getScript("js/config.js", function(){
 *		config.runCallback(callback);
 *	});	
 */

var config = {

    // Pass and run a callback (easy method)
	runCallback: function(callback) {
		$.ajax({
			url : "includes/get_devices.php",
			method : 'GET',
			dataType : 'json',
			success: function(data) {
				var devices = [];

				$.each(data.sensors, function(name, value) {
				    devices.push(value);
				});
				
				callback(devices);
			}
		});
	},

	
	// Get a deferred "promise" from jQuery AJAX with the config data
	// - can be used when runCallback isn't enough
	getDeferred: function () {
		return $.ajax({
			url : "includes/get_devices.php",
			method : 'GET',
			dataType : 'json'
		});
    },
}; 