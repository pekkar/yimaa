#mogrify 20110826-F29_A1_1_400.png -thumbnail 70x70
#convert -resize 75X75 -quality 80 20110826-F29_A1_1_461.png 20110826-F29_A1_1_461_80.jpg

import os
import sys

if (len(sys.argv) != 4):
	print "Requires full_image_dir quality[1..100] size[Width_Height]"
	sys.exit(-1)

imgpath = sys.argv[1]
quality = sys.argv[2]
resize = sys.argv[3].replace("_", "X")
experiment = imgpath.split("/")[-1]

#BWI_20110826-F29_C1_1_114.png
outcmd = open(experiment + ".all.out", "w")
for filename in os.listdir(imgpath):
	ftk = filename.split("-")
	if (len(ftk) >=2):
		dtk = ftk[1].split("_")
		dir = dtk[0] + "_" + dtk[1]
		if (not os.path.exists("./" + dir)):
			os.system("mkdir " + dir)
			os.system("mkdir " + dir + "/icons") 
	"""
	if (filename.find("BWI_") != -1 or filename.find("BW_") != -1 ):
		mvcmd = "mv " + filename + " BWI"
		print "mv BWI " + mvcmd
		os.system(mvcmd)
	"""	
	#continue	
	if (filename[-3:] == "png" and filename.find("_1_") != -1 and filename.find("BWI") == -1):
		im_cmd = "convert -resize %s -quality %s %s %s" %(resize, quality, filename, filename[0:-4] + ".jpg")
		print "Processing " + im_cmd
		os.system(im_cmd)		
		#outcmd.write(im_cmd + "\n");
		dtk = ftk[1].split("_")
                dir = dtk[0] + "_" + dtk[1]
		mvcmd = "mv " + filename + " ./" + dir
                mvcmd = "mv " + filename[0:-4] + ".jpg" + " ./" + dir + "/icons"
		os.system(mvcmd)

	"""
	if (filename[-3:] == "jpg"):
		dtk = ftk[1].split("_")
                dir = dtk[0] + "_" + dtk[1]
		mvcmd = "mv " + filename + " ./" + dir
		os.system(mvcmd)
	"""
outcmd.close()
