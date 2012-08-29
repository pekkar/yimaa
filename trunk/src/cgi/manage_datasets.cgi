#!/usr/bin/perl -T
#/usr/local/bin/perl -T
#use lib "/home/csbgroup/perl_lib/lib/perl5/site_perl/";
use strict;
use warnings;
use CGI;
use JSON;
#foreach (sort keys %ENV){
#	print "$_ : $ENV{$_}\n";
#}
my $dir_folder = "/home/csbgroup/public_html/visualization/DATASETS/AVAILABLE_DATASETS";
opendir (my $dir_content, $dir_folder) 
	|| die "Couldn't open the datasets folder.";
my $data_files =[];
@{$data_files}= readdir $dir_content;
my $out_data_files = [];
for(@{$data_files}){
	if ($_ =~/(\w+)/){
		if($_ !~ /\.json/){
			push(@{$out_data_files}, $_);
		}
	}#else {print $_;}
}
closedir($dir_content);
my $js_out = JSON->new->utf8->allow_nonref->encode($out_data_files);
my $cgi = CGI->new;
print $cgi->header(-type =>"application/json", -charset => "utf-8");
print $js_out;
