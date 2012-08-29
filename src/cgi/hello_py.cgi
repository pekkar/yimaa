#!/usr/bin/python
import cgi
import time
import sys
import MySQLdb

#pylog = open("./pylog", "a")
localtime = time.asctime( time.localtime(time.time()) )

def main():
	#pylog.write("start py re cgi " + time.asctime( time.localtime(time.time()) ) + "\n")
	configfile ="./rfex_sql.config"
        #config = db_util.getConfig(configfile)
	conn = MySQLdb.connect (host = "localhost",
                        port = 3306,
                        user = "visquick_rw",
                        passwd = "v1sr3ad",
                        db = "tcga")
        cur = conn.cursor()
	print "Content-type: text/html"  
	print
	print "<title>CGI 101+</title>"
	
	try:
		rc = cur.execute("select label, method, dataset_date, comments from regulome_explorer_dataset")
		re_datasets = cur.fetchall()
	except:
		e = sys.exc_info()[0]
		print "<h1>A First CGI example select error '%s'</h1>" % e	
	#	pylog.write(" select error \n" % e)	
	
	#pylog.write("after select "  + time.asctime( time.localtime(time.time()) ) + "\n")	
	print "<h1>A First CGI example</h1>"
	print "<P>Capture pathway source, group, url, gene members!</p>"
	for l in re_datasets:
		print "<P>Existing dataset " + "\t".join(l[0:4]) + " </P>"
	#pylog.close()        
	cur.close()
	conn.close()
main()

