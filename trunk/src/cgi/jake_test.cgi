#!/usr/bin/perl  -T
use warnings;
use strict;
use DBI;
use CGI;
print "ContentType: text/html\n\n";
#replace DATABASENAME with dbname
#replace HOSTNAME with MySQL server host/ip addr

my $drh=DBI->install_driver("mysql");
my $dsn="DBI:mysql:database=random_forest;host=localhost:3306";
my $dbh=DBI->connect($dsn, "visquick_rw","v1sr3ad");
my $sth=$dbh->prepare("SELECT * FROM chrom_info");
$sth->execute();
print $sth->rows();
while(my $ref=$sth->fetchrow_hashref()){
	print "Found a row: id = $ref->{'chr_name'},name=$ref->{'chr_length'}\n";
}
$sth->finish(),
$dbh->disconnect();
