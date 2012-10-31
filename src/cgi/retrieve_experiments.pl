#!/usr/bin/perl  -T
use strict;
use warnings;
use CGI;
use JSON;
use Cwd;
use Data::Dumper;

my $folder='/home/csbgroup/public_html/yimaa/PCA';
chdir $folder or die "Can't go to $folder";
$folder=getcwd();
opendir(my $folder_content, $folder) or die 'Cant open $folder';
my $data_files=[];
@{$data_files}=readdir $folder_content;
my $dts=[];
for(@{$data_files}){
	push(@{$dts},$1) if /\-([A-Z]{1,3}\d{1,4}\_[A-Z]\d)\_\d\_PC\.csv/;
#20110826-F29_A2_3_PC.csv
}
closedir($folder_content);

my %h;
@h{@{$dts}}=0;
my @uniques=keys(%h);

################################
# Sort the array by the last _int
# schwartzian_transform
# print
# map{ $_->[0]}
# sort {$a->[1] cmp $b ->[1]}
# map {[$_, /(\S+)$)/]}
# <>;
###############################
my @sorted=
	map{$_ -> [0]}
	sort {$a->[1] cmp $b->[1]}
	map{[$_, /([A-Z]{1,3}\d{1,4}\_[A-Z]\d)/]}
@uniques;


#print Dumper(\@sorted);
#ls |grep -E '[123].csv'|perl -e 'while(<>){print $1."\n" if/\-([A-Z]{1,3}\d{1,4}\_[A-Z]\d)/;}'
my $js_out=JSON->new->utf8->allow_nonref->encode(\@sorted);
my $cgi=CGI->new;
print $cgi->header(-type=>"application/json", -charset=>"utf-8");
print $js_out;

#ls |perl -e 'while(<>){print $1."\n" if/\-([A-Z]{1,3}\d{1,4}\_[A-Z]\d)\_\d\_PC\.csv/;}'

