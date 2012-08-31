#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use JSON;
use Data::Dumper;
use Encode;
use Cwd;
 
my ($cgi, $ca,$cb,$experiments,$exp,@dts);
my $atm_location=getcwd();
my $data_folder='/home/csbgroup/public_html/fluffy/pc/';

$cgi=CGI->new;

$experiments=$cgi->param('experiments');
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

my @experiments_arr = split(/,/, $experiments);
#my @dts = qw();

foreach $exp (@experiments_arr){
	push(@dts, grep(/${exp}\_\d\_PC\.csv$/,@data_files));
}

#my @dts=grep(/${experiments}\_\d\_PC\.csv$/,@data_files);
#print scalar(@dts)  . "\n";
#print $dts[0]  . "\n";
#print $dts[1]  . "\n";
#print $dts2[0]  . "\n";

#20110826-YO779_B3_2_PC.csv
closedir($folder_content);
my %result;
my $i;
#for my $i (@s){
$ca=~tr/cb//d;
$ca--;
$cb=~tr/cb//d;
$cb--;

my $counter = 0;
foreach(@dts){
#read PC.csv
	open(IN, $_) or die "Can't open $_  in datas$!\n";
	$_=~s/\_PC\.csv//g;
	#20110826-YO779_B3_2 #_PC
	my $k=$_;
	$k=$1 if($_=~/\_(\d)$/);
	$result{$counter}={
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
		push(@{$result{$counter}{'dt'}},{'id'=>$cb, 'y'=>$ar[$cb], 'x'=>$ar[$ca]});
	}
	my @tmp=sort{$a <=> $b} @{$result{$counter}{'dt'}};
	$result{$counter}{'minv'}=shift(@tmp);
	$result{$counter}{'maxv'}=pop(@tmp);
	close IN or die "Can't close $_ $!\n";
	$counter = $counter + 1;
}
#}
#change dt struct to [of obj]
my @json_dt;
while( (my ($ke, $v))=each(%result)){
#	print Dumper(\$v);
	push(@json_dt, $v);
}
print $cgi->header('application/json');
print encode_json(\@json_dt);
#print %result . "\n"  

