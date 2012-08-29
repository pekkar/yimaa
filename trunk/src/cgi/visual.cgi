#!/usr/bin/perl 
use strict;
use warnings;
use CGI;
my $cgi = CGI->new;
print $cgi->header(-type=>"text/html", charset=>"utf-8");
print $cgi->start_html(
#	-script=>{-type=>"text/javascript", -src=>"wisual.js"}),
-script=>{-type=>"text/javascript", -code=>'console.log("o");'}),
note im not working:
	$cgi->h1("Visualization");
print $cgi->end_html();
