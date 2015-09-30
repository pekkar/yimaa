# Yeast Image Analysis #

## ToDos ##
  * Data, Analysis
  * Fix yimaa from feedbacks
  * Link to static images
  * Documentation
  * Journal and manuscript

## Issues ##

### 04.10.2012 ###

  * In the PCA view, the colors of the plots are a little confusing... e.g. when I mouse over the red series, the amplified bubble is blue, so I'm not sure which series I'm looking at (as shown in screen shot). Also, could the labels be the strain names instead of "series x"? In this case I don't actually know which strain summary the series is...
> We will fix the colors and update the labels accordingly.
  * **The mouse over contains the strain id** jl


  * The newly redrawn graph sometimes overlaps the tabs, so i can't click on them anymore (as shown in the screen shot again). This might just be a browser thingy though? I'm using Firefox on a mac
![http://yimaa.googlecode.com/files/zhihao_screenshot.png](http://yimaa.googlecode.com/files/zhihao_screenshot.png)
  * I have never seen this but it's a browser thing - though I use Firefox and Chrome on Mac too. You say sometimes, see if you can write down the exact steps and then try it on say Adrian's computer.
  * **By in your screenshot, it shows that you selected 5 strains, F29\_Summary twice, my view is still to impose limit of max strain selection to be 3** jl


  * In the PCA view: Is there a plan to tackle the scrollbar at the bottom? e.g. right now when I pick the series of a F45 strain the scroll bar still shows a F29 strain. I'm not sure if you've decided what to display in the scroll bar if multiple strains are chosen?
When multiple strains are chosen, we will not show the scroll bar. When there is only one strain selection, we will update the scroll bar accordingly.

  * In the chart view: the charts don't update when a different strain is selected, they only update when a different feature is selected. The scroll bar sometimes updates when a different strain is selected only when I click on it, other times it automatically changes?
We will fix this.

  * As for the change points, here are some windows in my view:
  * F29\_A1: 260-300
  * F29\_A2: 260-290
  * F29\_A3: 270-310
  * F29\_B1: 150-180
  * F29\_C1: 180-210

  * The F45s are a little difficult to call fluffy/non-fluffy because once they get big enough to see properly they're pretty much fluffy already? So this might be more a size thing than anything else?
  * F45\_A2: 140-160
  * F45\_A3: can't call
  * F45\_D2: 140-160


  * No thumbnails for YAD145? But it shouldn't be called fluffy
  * No thumbnails for YO779 either?
  * **Will update image and thumbnail data and upload to GAE** jl


### 15.08.2012 ###

  * ~~Sort feature drop down to alphabetic order and fix the first letter to be uniform among features.~~
> => All are lowercase now

  * 3 different images (bin) to be added to image pop-up (.click() event).

  * Series count is not constant, ie. [1,3]

  * ~~Time series should start from 1 for all selected features.~~
> => Uses Highchart's own function now to detect the charts min and max values

  * The statistics div might get more feature details and possible a histogram or a piechart.

  * Relative size for images in the slider

> ~~Next skype call 3.8 Thu 2pm.~~
> => cancelled

  * Jump to #image introduced

### todo ###

  * Ask Pekka which one to use: svn or git for code.google../p/yimaa?

  * 3D PCA plot / images / rotation

  * 20 different experiments (update the drop down dynamically) folder structure in the server

  * Statistics layout

  * Possible new pulldown for charts involving multiple/groups of features

  * Remove tipsy from image scroll? (Duplicate information)