#!/usr/bin/python
import cgi
import time
import sys
import MySQLdb

form = cgi.FieldStorage()

source = form.getfirst('source', 'empty')
name = form.getfirst('name', 'empty')
members = form.getfirst('members', 'empty')
url = form.getfirst('url', 'empty')

members_list = members.split()
members_str = ','.join(members_list)

#source = "test"
#name = "tst"
#members_str ="asd,qwe,asd"
#url = "test.test"

try:
    conn = MySQLdb.connect (host= "localhost", port= 3306, user= "visquick_rw", passwd= "v1sr3ad", db = "random_forest")
    
    cur = conn.cursor()

    try:
        cur.execute("""SELECT pname FROM pathways WHERE pname = %s""", name)
        response = cur.fetchone()
        if response != None:
            cur.close()
            conn.close()
            sys.exit()

    except:
        cur.close()
        conn.close()
        sys.exit()
    
    try:
        cur.execute("""INSERT INTO pathways VALUES (%s, %s, %s, %s)""", (source, name, url, members_str))
        conn.commit()
    except:
        conn.rollback()

    cur.close()
    conn.close()
    print """\
        Content-Type: text/html\n
        <html><body>
           <p>%s, %s</p>
        </body></html>
        """%(name, members_str)

except:
    print """\
        Content-Type: text/html\n
        <html><body>
           <p>ERROR, something bad happened</p>
        </body></html>
        """

