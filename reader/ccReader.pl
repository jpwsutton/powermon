#!/usr/bin/perl

################################### Perl Modules ###################################

use strict;
use warnings;
use XML::Simple;
use Device::SerialPort qw( :PARAM :STAT 0.07 );
use POSIX qw /strftime/;
use LWP::Simple;
use HTTP::Request::Common qw(GET);
use Digest::MD5 qw(md5_hex);
use Data::Dumper;
use Getopt::Long;
use Pod::Usage;
use Config::Tiny;

####################################################################################




############################ Command-line option parsing ###########################

my %option = (
	help       => 0,
	quiet      => 0,
	debug      => 0,
	config     => undef,
	serialPort => "/dev/ttyUSB0",
	apiURL     => "http://www.example.invalid/powermon",
	apiSalt    => "salt"
);

GetOptions(
	'help'         => \$option{"help"},       # Display POD help documentation
	'quiet'        => \$option{"quiet"},      # Ssssh! Don't print anything to command line
	'debug'        => \$option{"debug"},      # Enable printing of debugging data
	'config=s'     => \$option{"config"},     # Location of the config file to use for sensors
	'serialPort=s' => \$option{"serialPort"}, # The serial port the EnviR is connected to
	'apiURL=s'     => \$option{"apiURL"},     # The URL to the web API
	'apiSalt=s'    => \$option{"apiSalt"}     # The salt for basic verification
);

# If parameter --help was provided, show the help POD
pod2usage() if ($option{"help"});

####################################################################################




########################### Set up variables for script ############################

# Number of retries before borking a data read
my $MAX_FAILS = 5;
my $MAX_SENSORS = 9;

# The sensors that you have paired with the EnviR
my %sensors;

# Read the configuration file for sensor names, if one was defined
if( defined $option{"config"} ) {

	printLine(1, "Reading sensors from config file $option{'config'}...");

	my $config = Config::Tiny->new;                             # Create config object
	$config = Config::Tiny->read( $option{"config"} );          # Open the config

	my $prefix = "sensor";                                      # Prefix for sensor no. in config

	for(my $i=0; $i < $MAX_SENSORS; $i++) {                       # Loop through the possible sensors
		my $sensor = $config->{sensors}->{"$prefix$i"};

		if(defined $sensor) {
			$sensors{$i}{name} = $sensor;               # Define sensor in script when found
			printLine(1, "Found sensor on $i, named \"$sensor\"");
		}
	}

} 
else {	# If no config was defined, just set to default:
	printLine(0, "No config defined. Using default numeric sensor names");

	$sensors{'0'}{name} = '0';
	$sensors{'1'}{name} = '1';
	$sensors{'2'}{name} = '2';
	$sensors{'3'}{name} = '3';
}


########## Don't change these:

# Date time 
my $date = strftime('%Y-%m-%d',localtime );
my $time = strftime('%T',localtime );
my $dateTime = ("$date $time");	

# User agent for LWP
my $ua = LWP::UserAgent->new;

# Serial port stuff
my $serialObj = Device::SerialPort->new($option{"serialPort"});

if (! defined $serialObj) {
	printLine(0, "Error: $option{'serialPort'} doesn't exist.");
	printLine(0, "Check settings, or try re-seating the EnviR USB connector.");
	exit(1);
}

$serialObj->baudrate(57600);
$serialObj->write_settings;

# Script variables
my $completeSensors = 0;
my $failedAttempts = 0;
my $sentValues = 0;


####################################################################################




####################################### MAIN #######################################

printLine(0, "CurrentCost Envir XML Parser V1.0 on $date\n");
printLine(1, "Running with --debug on. Output will be more verbose.");
printLine(0, "About to parse data...");

open(SERIAL, "+>$option{'serialPort'}");


# Loop until we have collected all of the sensors' data
while( $completeSensors < keys(%sensors) || $failedAttempts >= $MAX_FAILS )
{
	my $line = <SERIAL>;
	printLine(1, "\nReceived:\n" . $line);
	parseXML($line);
	
	printLine(0, "$completeSensors/" . keys(%sensors) . " read");

	# Break out of the loop if we're never going to get the missing sensors
	last if( $failedAttempts == $MAX_FAILS );
}

# In case we exited the loop due to a failover, let's write something to the log
if( $failedAttempts == $MAX_FAILS ) {
	printLine(0, "One or more sensors did not provide a reading- they could be turned off so we'll skip them.");

}

# We should now have a complete set of data
#print Dumper(%sensors);


printLine(0, "Sending values...");

# Generate the URLS
foreach my $key (sort keys %sensors)
{
	# Skip if we don't have any data for this sensor
	if( ! defined $sensors{$key}{watts} ) {
		printLine(0, "Skipping sensor \"$sensors{$key}{name}\", no data...");
		next;
	}

	# Construct the URL
	$sensors{$key}{url} = $option{"apiURL"} 
                            . '?device=' . $sensors{$key}{name}
                            . '&watts=' . $sensors{$key}{watts} 
                            . '&temp=' . $sensors{$key}{temp} 
                            . '&secID=' . $sensors{$key}{hash} 
                            . '&datestamp=' . $dateTime;

	printLine(1, "\nSensor: $key, URL: $sensors{$key}{url}\n");

	# Perform the GET request
	my $req = GET $sensors{$key}{url};
	my $res = $ua->request($req);

	if ($res->is_success) {
		printLine(1, $res->content);
	} else {
		printLine(1, $res->status_line);
   	}

	$sentValues++;
	printLine(0, "$sentValues/" . keys(%sensors) . " sent");
}

printLine(0, "Done!");

####################################################################################



#################################### Functions #####################################

# Print text to the screen
# Params:
#   $debugLevel (integer)
#	0 to ALWAYS print this string
#	any other integer will only print in debug mode
#   $text
#	The string to log to the console
# Returns:
#   1 if the text was printed
#   0 if it was not
sub printLine
{
	my $debugLevel = $_[0];
	my $text = $_[1];
	my $now  = strftime "%H:%M:%S", localtime;

	if( ! $option{"quiet"} ) { # If we're being quiet, don't write to console

		if( $debugLevel == 0 ) {
			printf("[%s] %s\n", $now, $text); # Print normal output
			return 1;
		} 
		elsif( $option{"debug"} == 1 ) {
			printf("[%s] %s\n", $now, $text); # Any other output will only be
			return 1;			  #  printed if the --debug flag is 
		}					  #  supplied on the command line.
	}
	return 0;
}


# Recieve an XML string and save the relevant data to the sensor hashmap
# Params:
#   $xmlString
#	The string to parse, read from the serial stream
sub parseXML
{
	my $xmlString = shift;
	
	my $opt = XMLin($xmlString);

	if ( defined $opt->{hist} ) {
		printLine(1, "Received history XML. Feature not implemented. Skipping.");
		return;
	}

	# Now we need to enter the data into the hash map
	# Does this sensor exist in our hash?
	if( exists $sensors{$opt->{sensor}} )
	{
		# The sensor is in our list, make sure we do not override it
		unless( exists $sensors{$opt->{sensor}}{watts} )
		{
			$sensors{$opt->{sensor}}{watts} = $opt->{ch1}->{watts};
			$sensors{$opt->{sensor}}{temp} = $opt->{tmpr};
			$sensors{$opt->{sensor}}{hash} = md5_hex($opt->{ch1}->{watts} . $option{"apiSalt"});
			$completeSensors++;
			
			printLine(1, "Sensor: $opt->{sensor}");
			printLine(1, "Watts:  $sensors{$opt->{sensor}}{watts}");
			printLine(1, "Temp:   $sensors{$opt->{sensor}}{temp}");
			printLine(1, "Hash:   $sensors{$opt->{sensor}}{hash}");
	
		} else {

			$failedAttempts++;

			printLine(0, "$failedAttempts/$MAX_FAILS failures");
			printLine(1, "Sensor: $opt->{sensor} (already read)");
		}

	}
}


####################################################################################



################################# Documentation ####################################


__END__

=head1 NAME

ccReader.pl - Parse XML data from the CurrentCost EnviR energy monitor, and submit
              it to an online service, usually a PHP script.


=head1 SYNOPSIS

perl ccReader.pl [options]

	Options:
	  -help        - Display this help and exit
	  -quiet       - Don't print anything to the command line 
	  -debug       - Enable printing of debugging data
          -config      - Read sensor names from configuration file
	  -serialPort  - The serial port the EnviR is connected to
                         Defaults to /dev/ttyUSB0.
	  -apiURL      - The URL of the web API to submit data to
	  -apiSalt     - The salt to use for basic verification


=head2 DESCRIPTION

This script reads data from a CurrentCost EnviR energy monitor, processes the XML,
and submits it to a web service over HTTP.

XML messages are read from the serial connection, matched to the sensors defined 
at the top of the script, then a URL is constructed containing the returned data.

If a sensor is turned off or otherwise not available, the script will give up after
a specified number of attempts, and will skip submitting data for it. This allows
sensors to be turned off with their connected appliances, without affecting the
submission of data for other sensors.

The EnviR produces history messages at certain intervals. These are currently
ignored, but it would be possible to implement a feature to submit these as a data
bundle.

=head2 CONFIGURATION

A configuration file can be provided to the script using the parameter -config.
This will be used to define names for the sensors connected to the EnviR. 

=head3 SAMPLE CONFIG

A sample configuration file:

     [sensors]
     sensor0="House"
     sensor1="Fridge-Freezer"
     sensor2="Family PC"
     sensor3="Living Room TV"

Up to 9 sensors (10 including sensor 0) can be defined. Sensors can also be 
ommitted, for example, jumping from sensor 2 to 5. Sensors connected to the
EnviR which are not in the configuration file will NOT be read!

=head2 DEPENDENCIES

You will need the following modules installed on your system to run this script:

	XML::Simple
	     Copyright 1999-2004 Grant McLean <grantm@cpan.org>
	
	LWP::Simple
	     Copyright 1997-2004, Gisle Aas <gisle@ActiveState.com>
	
	HTTP::Request::Common
	     Copyright 1997-2004, Gisle Aas <gisle@ActiveState.com>
	
	Device::SerialPort
	     Copyright (C) 1999, 2000-2007 Bill Birthisel, Kees Cook
	
	Digest::MD5
	     Copyright 1997-2004, Gisle Aas <gisle@ActiveState.com>
	
	Getopt::Long
	     Copyright 1990,2009 by Johan Vromans <jvromans@squirrel.nl>
	
	Config::Tiny
	     Copyright 2002-2011 Adam Kennedy. <adamk@cpan.org>
	
	Pod::Usage
	     Marek Rouchal <marekr@cpan.org>, Brad Appleton <bradapp@enteract.com>


All modules and their dependencies are available from CPAN.

=head1 AUTHOR

James Sutton - Original script
Sam Mitchell Finnigan - Bugfixes, additional features and documentation

=cut
