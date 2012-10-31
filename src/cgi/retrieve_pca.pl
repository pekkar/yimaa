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
my $data_folder='/home/csbgroup/public_html/yimaa/PCA_new/';

$cgi=CGI->new;

$experiments=$cgi->param('experiments');
$ca=$cgi->param('ca');
$cb=$cgi->param('cb'); #[cb1,cb3]

#my @s;
#push(@s,$ca);
#push(@s,$cb);
#go my dir
chdir $data_folder;
$data_folder=getcwd();
opendir(my $folder_content, $data_folder) or die 'Cant open $data_folder';
my @data_files=readdir $folder_content;
#A _PC.csv files

my @experiments_arr = split(/,/, $experiments);
foreach $exp (@experiments_arr){
	push(@dts, grep(/${exp}\_\d.csv$/,@data_files));
}

#20110826-YO779_B3_2_PC.csv
closedir($folder_content);
my %result;
$ca=~tr/cb//d;
$ca--;
$cb=~tr/cb//d;
$cb--;

#my @colors=qw(#AA4643, #89A54E, #80699B, #3D96AE, #DB843D, #92A8CD, #A47D7C, #B5CA92);
#blue #3E6695, #4572A7, #4F7FB6, #618CBE, #7399C5
#RED #983E3C #AA4643 #B9514D #C06360, #C77572
#green #7B9446 #89A54E #96B15B #A1BA6C #ACC27E
my @colors=(
	['#3E6695', '#4572A7', '#4F7FB6', '#618CBE', '#7399C5'],
	['#983E3C', '#AA4643', '#B9514D', '#C06360', '#C77572'],
	['#7B9446', '#89A54E', '#96B15B', '#A1BA6C', '#ACC27E']
);
my $strain_repl = "";
my @dts_sorted=
	map{$_->[0]}
	sort{$a->[1] cmp $b->[1] || $a->[2] <=> $b->[2]}
	map{[$_, /([A-Z]\d{1})_(\d){1}\.csv$/]}
@dts;
#print "\n sorted @dts_sorted";exit;
my $counter = 0;
foreach(@dts_sorted){
#read PC.csv
	open(IN, $_) or die "Can't open $_  in datas$!\n";
	$strain_repl=$_;	
	$strain_repl=~s/\.csv$//g;
        $_=~s/\_PC\.csv//g;
	#20110826-YO779_B3_2 #_PC
	my $k=$_;
	$k=$1 if($_=~/\_(\d)$/);
	$result{$counter}={
			minv=>'0',
			maxv=>'0',dt=>[] #{id:'',y:''},
		};
	#print Dumper(\%result);
	my $lin=1;
#	my $colour;
#	my $v;
	while(<IN>){
		next if /^0,/;
		my @ar=split(/\,/);
		$ar[$ca]=0 if $ar[$ca] =~/Nan/i;
		$ar[$ca]*=1;
		$ar[$cb]=0 if $ar[$cb] =~/Nan/i;
		$ar[$cb]*=1;
#		$colour=$lin;
#		$colour=~/^(\d?)/;
#		if($1-1 gt 4){$v=$colors[$counter][0]} #fix null values
#		else{
#			$v=$colors[$counter][$1-1];#=$1;$v--;
#		}
#		push(@{$result{$counter}{'dt'}},{'id'=>$lin, 'y'=>$ar[$cb], 'x'=>$ar[$ca], 'fillColor'=>$v, 'strain'=>$strain_repl});
		push(@{$result{$counter}{'dt'}},{'id'=>$lin, 'y'=>$ar[$cb], 'x'=>$ar[$ca], 'strain'=>$strain_repl});
		$lin++;	
	}
	my @tmp=sort{$a <=> $b} @{$result{$counter}{'dt'}};
	$result{$counter}{'minv'}=shift(@tmp);
	$result{$counter}{'maxv'}=pop(@tmp);
	close IN or die "Can't close $_ $!\n";
	$counter = $counter + 1;
}
#change dt struct to [of obj]
my @json_dt;
#while( (my ($ke, $v))=each(%result)){
foreach my $kkey(sort(keys %result)){
	#push(@json_dt, $v);
	push(@json_dt, $result{$kkey});
}
print $cgi->header('application/json');
print encode_json(\@json_dt);
#print Dumper(\@json_dt);
#print %result . "\n"  

