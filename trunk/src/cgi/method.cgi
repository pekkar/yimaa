#!/usr/bin/perl 
use strict;
use warnings;
use CGI;
my $cgi = CGI->new;
print $cgi->header(-type =>"text/html", -charset =>"utf-8");
print $cgi->start_html(),
	$cgi->h2("Method background"),
	$cgi->p({-class=>"bread"},
		"A novel data-driven computational method was developt to reveal the associations
		between different genetic features. The computation is made between 
		high-throughput data such as gene-expression profiles, microRNA or
		copy number variation and pre-defined sets of genes i.e pathways.
		First the pathway activities for each pathway are computed using the 
		 gene set enrichment algorithm. Then correlations between each pair of genetic feature
		and pathway are detected by forming a ROC curve and computing the area-under-curve
		(AUC). The statistical significance of the AUC is estimated by permutation testing
		giving p-values, that correspond the association between each feature and gene set."	
		
		."<br><br>"
		
		."These associations can be queried with the visualization tool. In the 
		visualization the genetic features are displayed under the \"Features\" section
		and the gene sets under \"Pathways\". An appropriate p-value threshold can be given
		to query the associations between the genetic elements."
	),
	$cgi->h2("Materials"),
	$cgi->p({class=>"bread"},
	"Expression data for glioblastoma multiforme was obtained from  
	<a href=\"http://www.cancerregulome.nih.gov\" title=\"TCGA\">
	the Cancer Genome Atlas (TCGA) project</a>
	. Pathways were collected fom 
	<a href=\"http://www.genome.jp/kegg/\" title=\"KEGG\">KEGG,</a>
	<a href=\"http://www.pathwaycommons.org/pc/\" title=\"Pathway Commons\">
	Pathway Commons,</a>
	<a href=\"http://www.biocarta.com\" title=\"Biocarta\">
	Biocarta,</a>
	<a href=\"http://www.geneontology.org/\" title=\"Gene Ontology\">GO</a>, and 
	<a href=\"http://www.wikipathways.org/index.php/WikiPathways\" title=\"WikiPathways\">
	WikiPathways</a>."
	),
	$cgi->end_html;
