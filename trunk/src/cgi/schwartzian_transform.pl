#!/usr/bin/perl	
#cmp changed to <=>
#print map { $_ ->[0] } sort { $a ->[1] <=> $b ->[1] } map { [$_, /(\S+)$/] } <>;
#\S !\s whitespace
#	<>;
#sort { $a <=> $b || $a cmp $b } @unsorted;
##THIS works for above: ###
#print map { $_ ->[0] } sort { $a ->[1] <=> $b ->[1] } map { [$_, /(\d+)\.png$/] } <>;
#20110826-F29_A1_1_210.png
#test while loop

my @ar;
push(@ar, $_) while(<>);
my @sorted=
	map{$_->[0]}
	sort{$a->[1] cmp $b ->[1] || $a->[2] <=> $b -> [2] }
	map{[$_, /([A-Z]\d{1})_(\d){1}\.csv$/]}
@ar;
print "sorted arry: @sorted\n";
