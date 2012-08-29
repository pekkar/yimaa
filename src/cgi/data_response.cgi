#!/usr/local/bin/perl -T
#use lib "/home/csbgroup/perl_lib/lib/perl5/site_perl/";
use strict;
use warnings;
use CGI;
use Cwd;
use Data::Dumper;
use File::Basename;
use File::chdir;
use JSON;
use Encode;
use Carp;
#BEGIN {	use Carp qw(carpout);	
#	open(my $LOG, '>>',"/home/csbgroup/cgi-bin/LOG") || die "Couldn't open LOG-file $!\n";
#	carpout($LOG); }
sub get_data;
sub get_group_data;
sub combine_data;
sub parse_params;
my $cgi = CGI -> new; 
my $request_method=$ENV{'REQUEST_METHOD'};
my ($dt_set, $p, @ft, @pw, $req_data); 
if($request_method eq "GET"){
	$dt_set = $cgi->param('dt_set');
	$p = $cgi->param('p'); 
	@ft = $cgi->param('ft'); 
	#@ft=("hsa-let-7b", "hsa-let-7a");
	@pw = $cgi->param('pw');
}#they told that foreach statement is faster than for loop
elsif($request_method eq "POST"){
	$req_data=$cgi->param('POSTDATA');
	my @dts=split(/&/, $req_data);
	$dt_set=$dts[0];
	$p=$dts[1];
	@ft=split(/,/, $dts[2]);
	@pw=split(/,/, $dts[-1]);
}
#	my $dt_set="testData.txt"; my $p=0.01; my @ft=("hsa-let-7b", "hsa-let-7a"); my @pw="GO";
my %feat_filtered_dt = &get_data($dt_set, $p, @ft);
my %grp_pws= &get_group_data($dt_set, @pw);
my $comb_ft_pw;
	#print Dumper(\%feat_filtered_dt);
&combine_data(\%feat_filtered_dt, \%grp_pws);
print $cgi->header(-type=>"application/json", -charset => "utf-8");	
print JSON->new->utf8->allow_nonref->encode($comb_ft_pw);
sub get_data{
	my $dtset = shift;
	my $pv = shift;
	my @fts = @_;
	#my $dtset = $cgi->param('dt_set');my $pv = $cgi->param('p');my @fts = $cgi->param('ft');
	local $CWD ="/home/csbgroup/public_html/visualization/DATASETS/AVAILABLE_DATASETS";
	open(IN, '<', $dtset) || die "Couldn't open $dtset in get_data: $!\n";
	my $header=<IN>;
	chomp $header;
	my @mir_array = split(/\t/, $header);
	chomp(@mir_array);
	chop($mir_array[-1]);
	my (%mir, @pws);
	my $mir_a_len = @mir_array;
	while(<IN>){
		chomp;
		my @row_array = split(/\t/);
		chomp(@row_array);
		chop($row_array[-1]);
#		push(@pws, $row_array[0]);
		for(my $i = 1; $i<$mir_a_len; $i++){
			#The no-p-value filter: (-1 values)
			if(( $row_array[$i] gt 0) and ($row_array[$i] lt $pv)){
				$mir{$mir_array[$i]}{$row_array[0]}=$row_array[$i]; #unless exists $mir{$mir_array[$i]}{$row_array[0]};
			#	print $mir{$mir_array[$i]}{$row_array[0]};
			}
		}
	}
	close IN or die "Couldn't close the user's input file: $!\n";
	#now I has the data in hashy with p-val filter;'
	#print Dumper(\%mir);
	my %filtered_f;
	foreach my $f(@fts){
		#I gets pw's -> p's;
		$filtered_f{$f}=$mir{$f};
	}
#I should have only the selected feat with filtered p's
#print Dumper(\%filtered_f);
return %filtered_f;
}
sub get_group_data{
	my $datset=shift;
	my @pways=@_;
	local $CWD ="/home/csbgroup/public_html/visualization/DATASETS/AVAILABLE_DATASETS/";
	if($datset=~/(\w+)/){
		$datset="pathwaygroup_" . $1 . ".json";
	}
	else{ die "Can't parse inputfile $datset\n";}
	my $some;
	{	
		local $/;
		open(my $IN, '<', $datset) || die "Couldn't open $datset in get_group_data: $!\n";
		$some = <$IN>;
		close $IN or die "Couldn't close the user's input file.";
	}
	my $pre_pre_json= decode("utf8", $some);
	my $pre_json = from_json($pre_pre_json);
	#for my $kk (keys %{$pre_json} ){
	#	print "$kk \n\n";
	#}
	#get all selected grps;
	my %pwgrp=(); 
	foreach my $g (@pways){
#		print "g: $g and pways: @pways";
		$pwgrp{$g}= $pre_json->{$g};
	}
#if pwgrp now I has all selected grps;
#print Dumper(\%pwgrp);
return %pwgrp;
}
sub combine_data{
	#\%feat_filtered_dt, \%grp_pws 
	my $fts=shift;
	my $gpws=shift;
	my %end_data;
	foreach my $f_key (sort keys %{$fts}){
#		print "$f_key\n";
		foreach my $f_v (sort keys %{$fts->{$f_key}}){
			#	while (my ($key, $value) = each %{$gpws}){
				foreach my $value (values %{$gpws}){
					foreach my $v (@{$value}){
						if($f_v eq $v){
							$end_data{$f_key}{$f_v} = $$fts{$f_key}->{$f_v};
							#$$comb_ft_pw{$f_key}{$f_v} = $$fts{$f_key}->{$f_v};
							#the second dt struct .. {[{}]}
							 my $h ={$f_v => $$fts{$f_key}->{$f_v}};
							push(@{$$comb_ft_pw{$f_key}}, $h);
						}
					}
				}
		}
	}
#print Dumper(\$comb_ft_pw);
return %end_data;
}
