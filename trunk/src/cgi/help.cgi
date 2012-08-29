#!/usr/bin/perl -T
use strict;
use warnings;
use CGI;
#http://perl.about.com/od/perltutorials/qt/perlheredoc.htm
#print <<EOF
#	header,
#	start_html('FAQ'),
#	hi("faQ"),
#	end_html
#EOF
my $cgi = CGI->new;
print $cgi->header(-type =>"text/html", -charset =>"utf-8");
print $cgi->start_html(),
	$cgi->h2("Usage of the visualization"),
	$cgi->h3("How to use the visualization tool."),
	$cgi->p({-class=>"bread"},
		"To visualize and query the relationship between
		different genetic elements you need to select the different
		elements under \"Features\" and \"Pathways\" section. 
		Start by selecting the appropriate pre-defined dataset from the 
		drop-down selector. The tool automaticly downloads the datasets
		and it's related variables. 
		Genetic elements can be selected by clicking them or by using the	
		search-tool. Selected elements will be highlighted in bold text.
		After selecting several features and pathways you need to
		set an appropriate p-value threshold. 
		The threshold is in the 0.xxx -format and 
		the default p-value threshold is 0.001."
		. "Finally you need to click the \"Show associations\" button to
		query the dataset. A text telling how many nodes and edges are
		presented will appear. The graph nodes presents the genetic elements, features
		and pathways, and the edges the associations between them. After the graph of 
		associations is displayed, the nodes can be dragged around using the mouse.
		The node names are automatically visible, but they can be hidden by deselecting
		the appropriate checkbox."
	),
	$cgi->h3("Search tool details."),
	$cgi->p({-class=>"bread"},
		"User can search features and pathways by adding a search string to the search box. 
		The search is case sensitive. Search is performed when the user clicks 	
		the \"Search\" button or hits enter.
		Deselecting selected elements can be done with the search also.
		If selected elements matches the search string, they will be deselected."
		. "Thus using the search it's fast way to select or deselect multiple elements 
		simultaneosly."
		."After performing the search a text telling how many matches was found will appear."
		),
	$cgi->h3("Browser support"),
	$cgi->p({-class=>"bread"},
		"If you are having troubles with the visualization
		and you are using older internet browser, please update
		your internet browser. The visualization works best with
		the newest version of 
		<a href=\"http://www.google.com/chrome?hl=en\" title=\"Chrome\">Chrome</a> 
		browser, which is recommended for the usage of the visualization tool.
		Internet Explorer isn't supported by the visualization and the tool won't work
		with IE."
	),
	$cgi->p({-class=>"bread"},
		"<br><br>"
		. "If you have any questions considering about the visualization,
		do not hesitate to ask. Questions and bug reports can be sent to saija.sorsa\@tut.fi."
	),	
	$cgi->end_html;
