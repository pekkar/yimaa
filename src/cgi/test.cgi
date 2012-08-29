#!/usr/bin/perl 
use strict;
use warnings;
use CGI;
use JSON;
use DBI;
use Encode;
use Cwd;
#print "ContentType: text/html\n\n";
#print $cgi -> header(-type=>"text/html", charset =>"utf-8");
#print $cgi->start_html(
#	-script=>{-type=>"text/javascript", -code=>'console.log("home");'}),
#$cgi->p( "Content-type: text/pain\n\n");
#print $cgi->end_html();
#`touch test_file_`;
#open(OUT,'>','test_file_')||die;
#print OUT "test\n";
#close OUT || die;

#my $drh=DBI->install_driver("mysql");
#my $dsn="DBI:mysql:database=random_forest;host=127.0.0.1:3306";
#my $dbh=DBI->connect($dsn, "visquick_rw","v1sr3ad");
#my $sth=$dbh->prepare("SELECT * FROM chrom_info");
#$sth->execute();
#print $sth->rows();
#print "fff";
################### ~~ smartmatch ############
my $header_file="/home/csbgroup/public_html/fluffy/header.json";
my $feature='Energy';
#go my dir
#xvmy $data_folder='/home/sorsas/20110826-F29_A1/';
my $data_folder='/home/csbgroup/public_html/20110826-F29_A1/';

chdir $data_folder;
$data_folder=getcwd();
opendir(my $folder_content, $data_folder) or die 'Cant open $data_folder';
my @data_files=readdir $folder_content;
my @dts=grep /\_(1|3|4)\.csv/,@data_files;
closedir($folder_content);
#get header.json
open(my $fh, $header_file) or die;
my $header_json=<$fh>;
my $header=decode_json($header_json);
#print join("\n", @{$header});
#print $#{$header};
my $len=scalar @{$header};
my $col= grep {${$header}[$_] eq $feature} 0 ..--$len;
#my $col = $feature~~@{$header};
print $col ."\n";
