#!/usr/bin/python
import cgi
import time
import sys
import MySQLdb

pylog = open("/home/csbgroup/httpd_rw/pylog", "a")
localtime = time.asctime( time.localtime(time.time()) )

def main():
	pylog.write("start py re cgi " + time.asctime( time.localtime(time.time()) ) + "\n")
	configfile ="./rfex_sql.config"
        #config = db_util.getConfig(configfile)
        #cur = conn.cursor()
	print "Content-type: text/html"  
	print
	print "<title>CGI 101+</title>"
	print "<h1>A First CGI example</h1>"
	#"we can try"
	try:
		conn = MySQLdb.connect (host = "localhost", port = 3306, user = "visquick_rw",passwd = "v1sr3ad",db = "tcga")

		cur = conn.cursor()
		select = "select label, method, dataset_date, comments from regulome_explorer_dataset"
		#select = "select 1"		
		rc = cur.execute(select)
		re_datasets = cur.fetchall()
		print "<P>Capture pathway source, group, url, gene members!</p>"
	        for l in re_datasets:
        	        print "<P>Existing dataset " + "\t".join(l[0:4]) + " </P>"
		cur.close()
		conn.close()
	except:
		e = sys.exc_info()[0]
		print "<h1>A First CGI example select error '%s'</h1>" % e	
	#	pylog.write(" select error \n" % e)	
	pylog.write("after select "  + time.asctime( time.localtime(time.time()) ) + "\n")	
	pylog.close()        
#main()

if __name__ == "__main__":
    main()
