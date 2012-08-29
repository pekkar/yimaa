#!/usr/bin/perl -T
use strict;
use warnings;
use CGI;
use JSON;
use Data::Dumper;
use Encode;
use Cwd;
 
my ($cgi, $ca,$cb,$folder);
my $atm_location=getcwd();
my $data_folder='/home/csbgroup/public_html/fluffy/pc/';

$cgi=CGI->new;

$folder=$cgi->param('folder');
$ca=$cgi->param('ca');
$cb=$cgi->param('cb'); #[cb1,cb3]
#print Dumper(\$cgi);
my @s;
push(@s,$ca);
push(@s,$cb);
#go my dir
chdir $data_folder;
$data_folder=getcwd();
opendir(my $folder_content, $data_folder) or die 'Cant open $data_folder';
my @data_files=readdir $folder_content;
#A _PC.csv files
my @dts=grep(/${folder}\_\d\_PC\.csv$/,@data_files);
#20110826-YO779_B3_2_PC.csv
closedir($folder_content);
my %result;
my $i;
#for my $i (@s){
$ca=~tr/cb//d;
$ca--;
$cb=~tr/cb//d;
$cb--;
foreach(@dts){
#read PC.csv
	open(IN, $_) or die "Can't open $_  in datas$!\n";
	$_=~s/\_PC\.csv//g;
	#20110826-YO779_B3_2 #_PC
	my $k=$_;
	$k=$1 if($_=~/\_(\d)$/);
	$result{$k}={
			minv=>'0',
			maxv=>'0',dt=>[] #{id:'',y:''},
		};
	#print Dumper(\%result);
	while(<IN>){
		next if /^0,/;
		my @ar=split(/\,/);
		$ar[$ca]=0 if $ar[$ca] =~/Nan/i;
		$ar[$ca]*=1;
		$ar[$cb]=0 if $ar[$cb] =~/Nan/i;
		$ar[$cb]*=1;
		push(@{$result{$k}{'dt'}},{'id'=>$cb, 'y'=>$ar[$cb], 'x'=>$ar[$ca]});
	}
	my @tmp=sort{$a <=> $b} @{$result{$k}{'dt'}};
	$result{$k}{'minv'}=shift(@tmp);
	$result{$k}{'maxv'}=pop(@tmp);
	close IN or die "Can't close $_ $!\n";
}
#}
#change dt struct to [of obj]
my @json_dt;
while( (my ($ke, $v))=each(%result)){
#	print Dumper(\$v);
	push(@json_dt, $v);
}
#print to .js
print $cgi->header('application/json');
print encode_json(\@json_dt);
