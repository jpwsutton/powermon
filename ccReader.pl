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


####################################################################################




############################ Command-line option parsing ###########################

my %opt = (
	help       => 0,
	quiet      => 0,
	debug      => 1,
	serialPort => "/dev/ttyUSB0",
	apiURL     => "http://www.example.invalid/powermon",
        apiSalt    => "salt"
);

GetOptions(
	'help'         => \$opt{"help"},
	'quiet'        => \$opt{"quiet"},
	'debug'        => \$opt{"debug"},
	'serialPort=s' => \$opt{"serialPort"}, # The serial port the EnviR is connected to
	'apiURL=s'     => \$opt{"apiURL"},     # The URL to the web API
	'apiSalt=s'    => \$opt{"apiSalt"}     # The salt for basic verification
);


####################################################################################




######################## Variables you might want to change ########################

# The sensors that you have paired with the EnviR
my %sensors;
$sensors{'0'}{name} = '1';
$sensors{'1'}{name} = '2';
#$sensors{'2'}{name} = '3';
#$sensors{'3'}{name} = '4';

# Number of retries before borking a data read
my $MAX_FAILS = 3;


########## Don't change these:

# Date time 
my $date = strftime('%Y-%m-%d',localtime );
my $time = strftime('%T',localtime );
my $dateTime = ("$date $time");	

# User agent for LWP
my $ua = LWP::UserAgent->new;

# Serial port stuff
my $serialObj = Device::SerialPort->new($opt{"serialPort"});
$serialObj->baudrate(57600);
$serialObj->write_settings;

# Script-global variables (ugh)
my $completeSensors = 0;
my $failedAttempts = 0;


####################################################################################




####################################### MAIN #######################################

printText(0, "CurrentCost Envir XML Parser V1.0\n\n");
printText(0, "About to parse data...\n");

open(SERIAL, "+>$opt{'serialPort'}");


# Loop until we have collected all of the sensors' data
while( $completeSensors < keys(%sensors) || $failedAttempts >= $MAX_FAILS )
{
	my $line = <SERIAL>;
#	print($line);
	parseXML($line);
	printText(0, "$completeSensors/" . keys(%sensors) . " read\n");		
}

# Incase we exited the loop due to a failover, lets write something to the log
if( $failedAttempts == $MAX_FAILS )
{
	logComment("One of the sensors does not seem to be working, please investigate!");

}
# We should now have a complete set of data

#print Dumper(%sensors);

# Generating the URLS

while ( (my $key) = each %sensors )
{
	$sensors{$key}{url} = $opt{"apiURL"} . '?device='
                            . $sensors{$key}{name}
                            . '&watts='. $sensors{$key}{watts} 
                            . '&temp=' . $sensors{$key}{temp} 
                            . '&secID=' . $sensors{$key}{hash} 
                            . '&datestamp=' . $dateTime;

	print "sensor: $key, url:  $sensors{$key}{url}\n\n";
	my $req = GET $sensors{$key}{url};
	my $res = $ua->request($req);

    if ($res->is_success) {
        print $res->content;
    } else {
        print $res->status_line . "\n";
    }
	print("\n");
	}





####################################################################################



#################################### Functions #####################################

#  Print text to the screen
sub printText
{
	my $debugLevel = $_[0];
	my $text = $_[1];
	if($debugLevel  == 0)
	{
		print($text);
	}
	
	if($debugLevel == 1)
	{
		if($opt{"debug"} == 1)
		{
			print($text);
		}
	
	}
}

sub logComment
{
	my $logText = $_[0];
	print("LOG>> $logText");
}


# Recieve an XML string and save the relevant data to the sensor hashmap
sub parseXML
{
	my $xmlString = $_[0];
	
	my $opt = XMLin($xmlString);

	# Now we need to enter the data into the hash map
	# Does this sensor exist in our hash?
	if(exists $sensors{$opt->{sensor}})
	{
		# The sensor is in our list, make sure we do not override it
		unless( exists $sensors{$opt->{sensor}}{watts} )
		{
			$sensors{$opt->{sensor}}{watts} = $opt->{ch1}->{watts};
			$sensors{$opt->{sensor}}{temp} = $opt->{tmpr};
			$sensors{$opt->{sensor}}{hash} = md5_hex($opt->{ch1}->{watts} . $opt{"apiSalt"});
			$completeSensors++;
			
			printText(1, "Sensor: $opt->{sensor}\n");
			printText(1, "Watts:  $sensors{$opt->{sensor}}{watts} \n");
			printText(1, "Temp:   $sensors{$opt->{sensor}}{temp} \n");
			printText(1, "Hash:   $sensors{$opt->{sensor}}{hash} \n");
	
		} else {
			# Sssh! We get a message if this exceeds $MAX_FAILS anyway...
			# printText(0, "You can't add the same sensor twice!\n");

			$failedAttempts++;
		}

	}
}




####################################################################################
