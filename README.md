powermon
========

Power Monitoring for Current Cost EnviR



This project consists of a number of different scripts, some or all of which we hope
will be useful to the wider community.

ccReader.pl
===========

A Perl script, which runs on the client directly connected to the EnviR and sends
data read over the USB serial connector to a set of PHP scripts running on a server,
via a HTTP request.

XML messages are read from the serial connection, matched to the sensors defined 
at the top of the script, then a URL is constructed containing the returned data.

If a sensor is turned off or otherwise not available, the script will give up after
a specified number of attempts, and will skip submitting data for it. This allows
sensors to be turned off with their connected appliances, without affecting the
submission of data for other sensors.

The EnviR produces history messages at certain intervals. These are currently
ignored, but it would be possible to implement a feature to submit these as a data
bundle.

A full list of options can be obtained by running `perl ccReader.pl --help`.


Author
======

James Sutton
     - Original script author


Contributors
============

Sam Mitchell Finnigan
     - Bugfixes, development, and documentation


