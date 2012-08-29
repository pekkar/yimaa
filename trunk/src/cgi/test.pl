open(OUT,'>','cgi_pl.log');
$t = localtime( );
$feature = "some_feature";
print OUT $t . "\n";
print OUT $feature . "\n";


print OUT localtime() . "\n";

close OUT;
