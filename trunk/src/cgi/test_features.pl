#!/usr/bin/perl
use strict;
use warnings;
use CGI;
use JSON;
use Data::Dumper;
use Encode;
use Cwd;
 
#use v5.10;
my ($cgi, $feature, $folder);
my $atm_location=getcwd();
my $header_file="/home/csbgroup/public_html/fluffy/header.json";
my $data_folder='/home/csbgroup/public_html/fluffy/pc/';

$cgi=CGI->new;
$feature=$cgi->param('feature');
$folder=$cgi->param('folder');

$feature="area";#$cgi->param('feature');
$folder="F29_A1";#$cgi->param('folder');

open(OUT,'>','feature_get_time.log');
print OUT localtime() . "\n";
print OUT $feature . "\n";

#go my dir
chdir $data_folder;
$data_folder=getcwd();
opendir(my $folder_content, $data_folder) or die 'Cant open $data_folder';
my @data_files=readdir $folder_content;
my @dts=grep /$folder\_(1|2|3)\.csv/,@data_files;
#for(@{$data_files}){push(@dts,$_) if /\_(1|3|4)\.csv/;}
closedir($folder_content);
#get header.json
open(my $fh, $header_file) or die;
my $header_json=<$fh>;
my $header=decode_json($header_json);
#my $col= grep { ${$header}[$_] eq $feature};
my $len= scalar @{$header};
my $i;
for($i=0;$i<$len;$i++){
	last if $header->[$i] =~/$feature/i;
	#if ($header->[$i] eq $feature ){
	#print $header->[$i]; last;}else{print $header->[$i];}
}
#determine the [feature] 
my %result;
foreach(@dts){
#read A _[1,3]_
	open(IN, $_) or die "Can't open $_ $!\n";
	$_=~s/\.csv//g;
	my $k=$_;
	$k=$1 if($_=~/\_(\d)$/);
	$result{$k}={
			minv=>'0',
			maxv=>'0',dt=>[] #{id:'',y:''},
		};
	#print Dumper(\%result);
	my $lin=1;
	while(<IN>){
		next if /^0,/;
		my @ar=split(/\,/);
		$ar[$i]=0 if $ar[$i] =~/Nan/i;
		$ar[$i]*=1;
	#	push(@{$result{$k}{'dt'}},$ar[$i]);
		push(@{$result{$k}{'dt'}},{'id'=>$lin, 'y'=>$ar[$i], 'x'=>$lin});
		$lin++;
	}
#print @{$result{$k}{'dt'}};
	my @tmp=sort{$a <=> $b} @{$result{$k}{'dt'}};
	$result{$k}{'minv'}=shift(@tmp);
	$result{$k}{'maxv'}=pop(@tmp);
	close IN or die "Can't close $_ $!\n";
}
#change dt struct to [of obj]
my @json_dt;
while( (my ($ke, $v))=each(%result)){
#	print Dumper(\$v);
	push(@json_dt, $v);
}

print OUT localtime() . "\n";
close OUT;
#print to .js
print $cgi->header('application/json');
print encode_json(\@json_dt);
