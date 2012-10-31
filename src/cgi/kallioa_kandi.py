#!/usr/bin/python
import cgi
import time
import sys
import json
import MySQLdb


def main():
    print "Content-type: text/html"
    print
	#"we can try"
    try:
        conn = MySQLdb.connect(host = "localhost", port = 3306, user = "visquick_rw",passwd = "v1sr3ad",db = "tcga")
        cur = conn.cursor()
        select = "select * from mv_crc_31july_feature_networks limit 500 "
        rc = cur.execute(select)
        re_datasets = cur.fetchall()
        data_list = []
        for line in re_datasets:
            data_hash= {}
            node1 = {}
            node2 = {}
            data_hash["pvalue"] = line[2]
            data_hash["importance"] = line[3]
            data_hash["correlation"] = line[4]
            data_hash["link_distance"] = line[29]
            node1["chr"] = line[10]
            node1["end"] = line[12]
            node1["id"] = line[0]
            node1["label"] = line[9]
            node1["source"] = line[8]
            node1["start"] = line[11]
            node2["chr"] = line[19]
            node2["end"] = line[21]
            node2["id"] = line[1]
            node2["label"] = line[18]
            node2["source"] = line[17]
            node2["start"] = line[20]

            data_hash["node1"] = node1
            data_hash["node2"] = node2
            data_list.append(data_hash)
        print json.dumps(data_list)
        cur.close()
        conn.close()
    except:
        e = sys.exc_info()[0]
        print "<h1>A First CGI example select error '%s'</h1>" % e
	#	pylog.write(" select error \n" % e)	
#main()

if __name__ == "__main__":
    main()
