#!/usr/bin/perl -T
use strict;
use warnings;
use CGI;
my $cgi = CGI ->new;
#home 
print $cgi -> header(-type=>"text/html", charset =>"utf-8");
print $cgi->start_html(
	-script=>{-type=>"text/javascript", -code=>'console.log("home");'}),
	$cgi->h2("Home"),
	$cgi->p({-class=>"bread"},
		"This is a development version.\n "
		. "<br><br>"
		. "Welcome to the web page of genetic feature visualization. "
		. "The aim of this page is to provide a generalized network visualization
		framework for inspecting the relationship between different genetic features
		such as microRNA and pre-defined gene sets i.e. pathways. The relationship is visualized as a bipartite graph,
		where nodes presents the features and pathways, and edges the connections between
		different node entities. "
		. "More information about the computational method can be found in the \"Method\" section. 
		In the \"Help\" page you can find general information about the usage of the visualization tool."
		. "<br><br>"
		. "The graph is created using the <a href=\"http://mbostock.github.com/d3/\" title= \"D3.js\">
		D3: Data-Driven Documents</a> JavaScript graphical library."
		. "The recommended browser for the visualization is 
		<a href=\"http://www.google.com/chrome?hl=en\" title=\"Chrome\">Chrome</a>."
		
	
	);
print $cgi->end_htm();
