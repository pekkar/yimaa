#!/usr/bin/perl  -T
use strict;
use warnings;
use CGI;
use JSON;
use Cwd;

my $folder='/home/csbgroup/public_html/fluffy/20110826-F29_A1/icons';
chdir $folder or die "Can't go to $folder";
$folder=getcwd();
opendir(my $folder_content, $folder) or die 'Cant open $folder';
my $data_files=[];
@{$data_files}=readdir $folder_content;
my $dts=[];
for(@{$data_files}){
	push(@{$dts},$_) if /\.jpg/;
}
closedir($folder_content);
#Sort the array by the last _int
#schwartzian_transform
#print
#map{ $_->[0]}
#sort {$a->[1] cmp $b ->[1]}
#map {[$_, /(\S+)$)/]}
#<>;
###
my @sorted=
	map{$_ -> [0]}
	sort {$a->[1] <=> $b->[1]}
	map{[$_, /(\d+)\.jpg/]}
@{$dts};
my $js_out=JSON->new->utf8->allow_nonref->encode(\@sorted);
my $cgi=CGI->new;
print $cgi->header(-type=>"application/json", -charset=>"utf-8");
print $js_out;


