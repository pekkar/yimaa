$(function(){
console.log("start retrieving initial images" + new Date());
var yimaa_mode = 'chart';
var previousSelected = "";

hs.addSlideshow({
	repeat:false,
	useControls:true,
	fixedControls:'fit',
	overlayOptions:{
		opacity: .6,
		hideOnMouseOut:true,
		position: 'bottom center',
		offsetX:0,
		offsetY:-10
	}
});
hs.transitions=['expand','crossfade']
hs.captionEval="this.thumb.alt";
hs.allowWidthReduction=true;
hs.allowHeightReduction=true;
hs.maxHeight=200;
hs.maxWidth=200;
//================ NAVIGATION ==================
$('ul li #other').click(function(){
	$('#main_div').text('Dummyhtml');
	$('#main_div').css('padding-top','20px');
});

$('ul li #faq').click(function(){
	$('#main_div').css('padding-top','20px');
});
//===================Stats======================
var retrieve_exp_url='/cgi-bin/retrieve_exp.pl';
$.getJSON('header_lowercase.json',function(datas){
	$('#tab_navigation').append('<select id="features" <span title="Image Classification Features - See Info Features for more Info" class="tooltip"></span> class="dd">');
	//$('#features').setLabel("Feature");
	//$('#features').change(initCallbackFunction);
	$('#tab_navigation').append('<select id="dtSet" title="Natural Variation Experiments" multiple="multiple">');
/*	$('#dtSet').change(function (ov, nv){
			var strain = $('#dtSet').val();		
			$.getJSON(retrieve_exp_url, {exp:strain}, function(datas){
        			carouselItems=datas;
				//alert("load carousel");
        			//initCallbackFunction();
        			carouselLoad(strain, datas);
				uploadNewData();
			});			
		}
	);*/
	//$('#dtSet').label("Strain");
	var i;
	for(i=0;i<datas.length;i+=1){
		$('#tab_navigation > #features').append(function(d){
				return '<option value="'+datas[i]+'">'+datas[i]+'</option>';
		})
	}
	 $("#features").multiselect({
        noneSelectedText: 'Choose dataset',
        minWidth: '140',
        header: false,
	selectedList: 1,
        multiple: false,
	classes: 'features', 
        click: uploadNewData
    });
});

$('#stats1').append('<p>'+
	'Feature <span id="selected_feature"></span> details'+
	'<br>Average: <span class="dtls_span" id="average"></span>'+
	'Min: <span class="dtls_span" id="min"></span>'+
	'Max: <span class="dtls_span" id="max"></span>'+
	'<br><br>'+
	'Image: <input type="text" id="image_span"></input><span id="img_span"><span>'+
	'</p>'
);


$('#stats2').append('<ul>');
$('#stats2').append('<p>'+
	'<span class="dtls_span" >Time frame: <input type="text" id="frame_span"></input></span>'+
	'<span class="dtls_span" id="series0">Series1 value:</span>'+
	'<span class="dtls_span" id="series1">Series2 value:</span>'+
	'<span class="dtls_span" id="series2">Series3 value:</span>'+
	'</p>'
);
$('#scroll').append('<div class="scroll-pane" id="spaneid">');
$('.scroll-pane').append('<div class="scroll-content" id="scontentid">');
$('.scroll-pane').append('<div class="scroll-bar-wrap ui-widget-content ui-corner-bottom">'+
	'<div class="scroll-bar"></div></div>');

$('#frame_span').keydown(function(){
	var schr=event.keyCode;
	//8 backspace, 46 delete
	if(schr===8||schr===46) return;	
	//13 enter
	if(schr===13){
		var max_value=scrollbar.slider('option','max');
		var jmp_txt=$('#frame_span').val();	
		jmp_txt++;
		if(jmp_txt>max_value){
			//jump2max
			console.log(max_value);
			scrollbar.slider('option','value',max_value);	
		}
		else if(jmp_txt<=0) {
			scrollbar.slider('option','value',scrollbar.slider('option','min'));
		}
		else{
			scrollbar.slider('option','value',jmp_txt);
		}
	};
});

$('#image_span').keydown(function(){
	var schr=event.keyCode;
	if(schr===8||schr===46) return;	
	if(schr===13){
		var max_value=scrollbar.slider('option','max');
		var jmp_txt=$('#image_span').val();	
		jmp_txt=jmp_txt-img_min+1;
		if(jmp_txt>max_value){
			//jump2max
			console.log(max_value);
			scrollbar.slider('option','value',max_value);	
		}
		else if(jmp_txt<=0) {
			scrollbar.slider('option','value',scrollbar.slider('option','min'));
		}
		else{
			scrollbar.slider('option','value',jmp_txt);
		}
	};
});


function getYiiImages(strain, imgc){
        var serie = 1;
        var img_link = strain + "/20110826-" + strain + "_" + serie + "_" + imgc + ".png";
        var binary_img_link = (strain + "/binary/" + strain + "_" + serie + "_" + imgc + ".png").replace("20110826-","");
        serie = serie + 1;
        $('#tr1').html('<a href="' + img_link + '" target="_blank"><img src="' + img_link + '" style"=visibility: visible"></a>');
        $('#tr1b').html('<a href="'+binary_img_link+ '" target="_blank"><img src="'+binary_img_link + '" style"=visibility: visible"></a>');
	img_link = strain + "/20110826-" + strain + "_" + serie + "_" + imgc + ".png";        
	binary_img_link = (strain + "/binary/" + strain + "_" + serie + "_" + imgc + ".png").replace("20110826-","");
	$('#tr2').html('<a href="' + img_link + '" target="_blank"><img src="' + img_link + '" style"=visibility: visible"></a>');
        $('#tr2b').html('<a href="'+binary_img_link+ '" target="_blank"><img src="'+binary_img_link + '" style"=visibility: visible"></a>');
        serie = serie + 1;
	img_link = strain + "/20110826-" + strain + "_" + serie + "_" + imgc + ".png";                
	binary_img_link = (strain + "/binary/" + strain + "_" + serie + "_" + imgc + ".png").replace("20110826-","");
        $('#tr3').html('<a href="' + img_link + '" target="_blank"><img src="' + img_link + '" style"=visibility: visible"></a>');
        $('#tr3b').html('<a href="'+binary_img_link+ '" target="_blank"><img src="'+binary_img_link + '" style"=visibility: visible"></a>');
	if($('#vis_image').css("visibility")=='visible'){
        	$('#vis_image img').each(function(){
                	$(this).css("visibility",'visible');
                });
        }
}

//=================================TABNAVIGATION==============
/*
$('#main_div').prepend('<div id="tab_navigation">'
+'<ul class="tab_navi">'
+'<li><a href="#vis_chart" id="visChart">Chart</a></li>'
+'<li><a href="#vis_image" id="visImage">Images</aplot1'+'</u>'
);
//in. html
//$('.tab_navi').tabs();
//$('#visImage').click(function(){
//	console.log(this);
//$('#main_div div').each(function(){
//		if($(this).attr("id") !== 'tab_navigation'){
/*		$(this).remove(); //css("visibility","hidden");
		}	
	});

//});
*/
$('#vis_image').css("visibility","hidden");
$('#vis_image').addClass("plot");
$('#PCAdiv').addClass("plot");

$('#pca_cb_div').append(
	'<span class="pcacb">PCA1</span>'
	+'<input class="pcacb" id="cb1" type="checkbox"/>'
	+'<span class="pcacb">PCA2</span>'
	+'<input class="pcacb" id="cb2" type="checkbox"/>'
	+'<span class="pcacb">PCA3</span>'
	+'<input class="pcacb" id="cb3" type="checkbox"/>'
);

$('input:checkbox').change(function(){
	/*var maxSelected='2';
	var nowSelected=$('input:checked').size();
	if(nowSelected > maxSelected){
		this.checked=false;
	}else if (nowSelected == 2){
		initScatter();
	}*/
        var cb1_checked = document.getElementById("cb1").checked;
        var cb2_checked = document.getElementById("cb2").checked;
        var cb3_checked = document.getElementById("cb3").checked;
        if ((cb1_checked && cb2_checked) || (cb1_checked && cb3_checked) || (cb2_checked && cb3_checked))
        {
                initScatter($('#dtSet').val().toString());
        }
        if (cb1_checked && cb2_checked && cb3_checked){
                alert("Sorry, only two PCA components can be selected at once");
		this.checked =false;
        }		
});

/*$('#pca_cb_div').append(
	'<button class="pcacb" >Update</button>'
);
*/

$('button.ui-multiselect').click(initScatter);
	
//================DIVS====================================

$('#visImage').click(function(){
	//$('#plot1').toggle();
	$('#plot1').css("display","none");
	$('#PCAdiv').css("display","none");
	
        $('.dd').each(function(ind,ele){
		$(ele).css("display","none");
	})
	$('#vis_image img').each(function(i,e){
		$(e).css("visibility","visible");
	});
	$('#vis_image').css("display","inline");
	$('.pcacb').css("display","none");
});

$('#visChart').click(function(){
        $('#stats').css("display","");
        //$('#stats2').css("display","");

	$('.features').css("display","");
	$('#plot1').css("display","inline");
	//$('#vis_image').removeClass("plot");
	$('.dd').each(function(ind,ele){
		$(ele).css("display","inline");
	});
	$('#pca_cb_div').css("display","none");
	$('#vis_image').css("display","none");
	$('#PCAdiv').css("display","none");
	$('.pcacb').css("display","none");
    $("#dtSet").multiselect('option', {multiple: false, open: function(event, ui){
        $("#dtSet").multiselect("uncheckAll");}
    });

});

$('#PCAdiv').css("display","none");
$('#pca_cb_div').css("display","none");

$('#visPCA').click(function(){
	$('#PCAdiv').css("display","inline");
        $('#stats').css("display","none");
	//$('#stats2').css("display","none");

	$('#plot1').css("display","none");
	$('#vis_image').css("display","none");
	$('.features').css("display","none");
	$('#pca_cb_div').css("display","inline");
	$('.pcacb').css("display","inline");
	$('button.pcacb').css("display","inline");
	yimaa_mode = 'PCA';
	initScatter();
    $("#dtSet").multiselect('option', {multiple: true, open: function(event, ui){}});
});

//========================END==========================================
var carouselItems;
//var imagepl='/cgi-bin/fluffy_datas.pl';
var hchart;
var hoptions;
var scrollbar;
var img_min;
var strain = $('#dtSet').val();
if (strain == undefined || strain == ""){
	strain = "F29_A1";
}

$.getJSON(retrieve_exp_url, {exp:strain}, function(exp_icons){
//$.getJSON(imagepl, function(datas){
	carouselItems=exp_icons;
	initCallbackFunction(strain);
	carouselLoad(strain, exp_icons);
});

$.getJSON('/cgi-bin/fluffy_dtset.pl', function(datas){
	var l;
	for(l=0;l<datas.length;l++){
		$('#dtSet').append(function(d){
			if (l == 0) return '<option value="'+datas[l]+'" selected="selected">'+datas[l]+'</option>';
			return '<option value="'+datas[l]+'">'+datas[l]+'</option>';
		})
	}
    $("#dtSet").multiselect({
        noneSelectedText: 'Choose dataset',
        minWidth: '140',
	    selectedList: 3,
        header: false,
        multiple: false,
        classes: "dtSet",
        click: function(event, ui){
        var strain = ui.value;
	if (yimaa_mode == 'chart'){
        var retrieve_exp_url='/cgi-bin/retrieve_exp.pl';       
			$.getJSON(retrieve_exp_url, {exp:strain}, function(datas){
        			carouselItems=datas;
				//alert("load carousel");
        			//initCallbackFunction();
        			carouselLoad(strain, datas);
				uploadNewData();
			});			
       /* console.log([ui.value, ui.text]);
	alert("select " + ui.text);
	//$("#dtSet").va(ui.text);
	*/
        }
	if (yimaa_mode == 'PCA'){
		//alert('call retrieve_pca for strains ' + strain + ' what to do about icon slider?');
		var val_arr = $('#dtSet').multiselect('getChecked');
		var strain = '';
		for (var i = 0; i < val_arr.length; i++){
			strain = strain + val_arr[i].value + ',';
		}
		initScatter(strain.substring(0,strain.length-1));
	}
        },
        open: function(event, ui){
            $("#dtSet").multiselect("uncheckAll");
        }
    
    });

    

});
var scatterData;
function initScatter(experiments){

	if (experiments == undefined)
		experiments = 'F29_A1';

        var post_url="/cgi-bin/retrieve_pca.pl";
	if (! document.getElementById("cb1").checked && ! document.getElementById("cb2").checked  && ! document.getElementById("cb3").checked ){
        	$('#cb1').attr('checked','true');
                $('#cb2').attr('checked','true');
	}
	var cb1_checked = document.getElementById("cb1").checked;
        var cb2_checked = document.getElementById("cb2").checked;
        var cb3_checked = document.getElementById("cb3").checked;
        var c1id = "";
        var c2id = "";
        if (cb1_checked)
                c1id = "cb1";
        if (cb2_checked){
                if (c1id == ""){
                        c1id = "cb2";
                        c2id = "cb3";
                }else{
                        c2id = "cb2";
                }
        }else{
                c2id = "cb3";
        }
	var sOptions={
		chart:{
			renderTo:'PCAdiv',
			type:'scatter',
			borderColor:'',
			zoomType:'xy'
		},
		title:{	
			text:experiments
		},
		xAxis:{
			stratOnTick: true,
			endOnTick:true
		},
		tooltip: {
                	formatter: function() {
                        	return 'Frame: ' + this.point.id + ' X:'+
                        	this.x +', Y:'+ this.y;
                	}
            	},
		plotOptions:{
			scatter:{
				marker:{
					radius:'1'
				},
				states:{
					hover: {
						marker: {
							enabled: true,
							radius:'2'
						}
					}
				}
			},
			series:{
				cursor:'pointer',
				allowPointSelect: true, 
				point:{
					events:{
					mouseOver:function(eve){
						var pointsScatter=[];
						var imgc=this['id']+parseInt(img_min)-1;
						$('#image_span').val(imgc);
						$('#frame_span').val(this['id']);
						for(j=0;j<scatterData.length;j++){	
							for(i=0;i<scatterData[j]['dt'].length;i++){
								if(scatterData[j]['dt'][i]['id']===this.id){
									$('#series'+j).text("Series"+(j+1)+" value: "+scatterData[j]['dt'][i]['y']);
									pointsScatter.push(scatterData[j]['dt'][i])
								}
							}
						}		
					},//MOEOF
					click: function(eve){
						//add code to see which series was selected to figured out the right strain being []
						var imgc = this['id'];
						var yindex = Math.floor(this.series.index/3);
                                                var strain = $('#dtSet').val()[yindex]; //for multiple
                        console.log("20110826-" + strain + "_1"  + "_" + imgc);
					    	if (previousSelected != ""){
							$(previousSelected).removeClass("selected_img");
						}	
                                            $("#20110826-" + strain + "_1"  + "_" + imgc).addClass("selected_img");
						getYiiImages(strain, imgc);
						previousSelected = "#20110826-" + strain + "_1"  + "_" + imgc;
                                                $('#visImage').click();
                                                var offset = 22;//this['id'] / 20;
                                                if (this['id'] < 420) offset = 20;
                                                if (this['id'] < 320) offset = 17;
                                                if (this['id'] < 250) offset = 15;
                                                if (this['id'] < 200) offset = 14;
                                                if (this['id'] < 150) offset = 12;
                                                if (this['id'] < 100) offset = 10;
                                                if (this['id'] < 70)  offset = 7;
                                                if (this['id'] < 40)  offset = 3;
                                                var yframe = this['id'] - offset;
                                                $('.scroll-bar').slider('value', yframe);
					}
					}
				}
			}
		},
		series:[]	
	};
	$.getJSON(post_url,{experiments:experiments, ca:c1id, cb:c2id} ,function(dts){
		var j;
		scatterData=dts;
		for(j=0;j<dts.length;j++){
		sOptions.series.push({	data:dts[j]['dt']});
				//sOptions.series[j].name=j+1;
				//sOptions.series[j].data=dts[j]['dt'];	
			}
	var sChart = new Highcharts.Chart(sOptions);
	});
};

function uploadNewData(){
if($('#PCAdiv').css("display")==='inline'){
	initScatter(null);
	return;
}
//$('#dtSet').change(function(){
////TODO
	//dl another dt set 
	var t=$('#features option:selected ')[0].value;
	var t2 = $('#dtSet option:selected')[0].value;
		var post_url="/cgi-bin/fluffy_features.pl";
		var minval,maxval;
		minval=10000;maxval=0;
		$.get(post_url,{feature:t, folder:t2},function(dts){
			var j;
			for(j=0;j<dts.length;j++){
				//no .setData(,false);
				hoptions.series[j].name=j+1;
				hoptions.series[j].data=dts[j]['dt'];	
				if(dts[j]['minv']['y']<minval) minval=dts[j]['minv']['y'];
				if(dts[j]['maxv']['y']>maxval) maxval=dts[j]['maxv']['y'];
			}
		hoptions.title={text:t};
		hchart.hideLoading();	
		hchart.destroy();
		hchart=new Highcharts.Chart(hoptions);
		});
	}

/*function uploadNewFeatureData(){

};
*/
function initCallbackFunction(strain){

	$('#features option[value="area"]').attr('selected','selected');
	$('#dtSet').val(strain);
	$('#dtSet option[value="' + strain + '"]').attr('selected','selected');
	var t=$('#features option:selected ')[0].value;
	$('#selected_feature').text(t);
	if(hchart) hchart.showLoading('Loading...');
		var post_url="/cgi-bin/fluffy_features.pl";
		var j,minval,maxval;
		console.log("Initial getting " + t + " time " + new Date());
		$.get(post_url,{feature:t, folder:strain},function(dts){
		console.log("Returned from GET " + t + " time " + new Date());
		//hchart=new Highcharts.Chart({
	hoptions={
		chart: {
			renderTo:'plot1',
			type:'spline',
			borderColor:''
		},title: {text:t,
			align:'right',
			style:{
				color:'black',
				fontWeight:'bold'
			}},
		xAxis:{
			margin:[10,10,10,10],
			min:0
			//max:500
		},yAxis:{	title:''},
		legend:{
			align: 'left',
			floating: true,
			verticalAlign: 'top',
			borderWidth:0,
			x:20
		},plotOptions:{
			spline:{
				lineWidth:1,
				shadow:false,
				states:{
					hover:{	lineWidth:1}
				},
				marker:{
					enabled:false,
					states:{
						hover:{	enabled: false,}	
					}
				}
			},
			series:{
				cursor:'pointer',
				allowPointSelect: true, 
				point:{
					events:{
					mouseOver:function(eve){
						var points=[];
						var imgc=this['id']+parseInt(img_min)-1;
						$('#image_span').val(imgc);
						$('#frame_span').val(this['id']);
						for(j=0;j<dts.length;j++){	
							for(i=0;i<dts[j]['dt'].length;i++){
							if(dts[j]['dt'][i]['id']===this.id){
							$('#series'+j).text("Series"+(j+1)+" value: "+dts[j]['dt'][i]['y']);
							points.push(dts[j]['dt'][i])
							}
						}
				if(dts[j]['minv']['y']<minval) minval=dts[j]['minv']['y'];
				if(dts[j]['maxv']['y']>maxval) maxval=dts[j]['maxv']['y'];
						}//end for		
			$('#min').text(minval);
				$('#max').text(maxval);
					}//MOEOF
					,click:function(eve){
						var imgc = this['id']+parseInt(img_min)-1;
						var strain = $('#dtSet').val();//[] for multiple
					    $("#20110826-" + strain + "_1"  + "_" + imgc).addClass("selected_img");
					    getYiiImages(strain, imgc);
						if (previousSelected != ""){
                                                        $(previousSelected).removeClass("selected_img");        
                                                }
                                                previousSelected = "#20110826-" + strain + "_1"  + "_" + imgc;
                				$('#visImage').click();
						var offset = 22;//this['id'] / 20;
						if (this['id'] < 420) offset = 20;	
						if (this['id'] < 320) offset = 17;
						if (this['id'] < 250) offset = 15;
						if (this['id'] < 200) offset = 14;
						if (this['id'] < 150) offset = 12;
						if (this['id'] < 100) offset = 10;
						if (this['id'] < 70)  offset = 7;
						if (this['id'] < 40)  offset = 3;
						var yframe = this['id'] - offset;
						$('.scroll-bar').slider('value', yframe);
					}
					}
				}//end point
			}//end series
		},
		tooltip:{
			shared:true,//A arvot	
			useHTML:true,
			crosshairs: [true,true]
		},
		series:[]
	}
	minval=100000;maxval=-100000;
	for(j=0;j<dts.length;j++){	
			hoptions.series.push({
				data:dts[j]['dt']	
			});
			if(dts[j]['minv']['y']<minval) minval=dts[j]['minv']['y'];
			if(dts[j]['maxv']['y']>maxval) maxval=dts[j]['maxv']['y'];
	}
	if(hchart){ hchart.hideLoading();hchart.destroy();}
	hchart=new Highcharts.Chart(hoptions);
	$('#min').text(minval);
	$('#max').text(maxval);
	console.log("Done getting " + t + " time " + new Date());
	});//end get
$(".scroll-pane").css("overflow","hidden");
};//EOF initCallbackFunction


function carouselHTML(strain, item){
	var img_re=/([A-Z][0-9]{0,2}_[A-Z][a-zA-Z0-9]_[0-9]_[0-9]{0,3})\.jpg$/;
	var aid=img_re.exec(item)[1];
	item = item.replace(".jpg", "");
	return '<img src="' + strain + '/icons/'+item+'" id="'
	+item+'" width="75px" height="75px" class="scroll-content-item"/>'
	+'<p class="span_carousel"><span id='+item+'>'+aid+'</span></p>';
};

function imageHTML(item){
var img_re=/([A-Z][0-9]{0,2}_[A-Z][a-zA-Z0-9]_[0-9]_[0-9]{0,3})\.png$/;
var aid=img_re.exec(item)[1];
return '<img src="20110826-F29_A1'
+item+'" id="'
+item+'" alt="'+item+'"/>';
};

function carouselLoad(strain, datas){
	$('#scontentid').empty();
	scrollbar=$('.scroll-bar').slider({
	//step:7, //evenly divisible by (max-min)
		slide: function(event,ui){
			if($('.scroll-content').width() > $('.scroll-pane').width()){
				$('.scroll-content').css("margin-left",Math.round(
				ui.value / datas.length * ($('.scroll-pane').width()*2 - $('.scroll-content').width())
			//	datas[ui.value] / 100 * ($('.scroll-pane').width() - $('.scroll-content').width())
				) +'px');
			}
			else{
				$('.scroll-content').css('margin-left',0);
			}
		},
		max: datas.length-1,
		min:0,
		step:Math.floor(datas.length/100),
		change: function(event,ui){
		        console.log(ui.value);
			if($('.scroll-content').width() > $('.scroll-pane').width()){
			$('.scroll-content').css("margin-left",Math.round(
				ui.value / datas.length * ($('.scroll-pane').width()*2 - $('.scroll-content').width())
				) +'px');
			}
			else{
				$('.scroll-content').css('margin-left',0);
			}
		}
	});
	//HWIDTH
	var w=datas.length*(83);// + parseInt($('a img').css("margin-left") ) );
	$('.scroll-content').css("width",w); 

	for(var i=0;i<datas.length;i++){
		var j=$('.scroll-content').append(carouselHTML(strain, datas[i]));
		$('.scroll-content > img').mouseover(function(){
	//		var indice=$(this).attr("jcarouselindex");
		//	var feature=datas[indice].src;
		//	$('ul.stats_list > #results').text("feature results:"+feature);	
			//OLD class change 
		//	$('ul.jcarousel-list li img').each(function(k,v){
			//$(v).removeClass('activeItem');
		//	});
			//$('img',this).addClass('activeItem');
			var img_id=$(this).attr("id");
			var img_re=/([0-9]{0,3})$/;
			var aid=img_re.exec(img_id)[1];
			var b=aid.toString();
			b=b-img_min+1;
			var pnt=hchart.get(b);
			pnt.onMouseOver();
		}); //mouseover
	
/*		$(j).tipsy({title:function(){
			var source=($(this).find('img').attr("id"));	return source;},
			gravity:'s',fallback:'testfallback'
		});*/
	}//EOFOR
	$('.scroll-content > img').each(function(){
		var s=this.id;
		var s2=s.replace("jpg","png");
		var serie = 1;
		$(this).click(function(){
		//getYiiImages(strain, imgc);
		var series_u = s2.replace(strain + "_1", strain+"_" + serie);
		var binary_img_link = (strain + "/binary/" + series_u + ".png").replace("20110826-","");
		serie = serie + 1; 
		$('#tr1').html('<a href="' + strain + '/'+series_u+'" target="_blank"><img src="' + strain + '/'+series_u+'" style"=visibility: visible"></a>');
		$('#tr1b').html('<a href="'+binary_img_link+ '" target="_blank"><img src="'+binary_img_link + '" style"=visibility: visible"></a>');
		serie = 2;
		series_u = s2.replace(strain + "_1", strain+"_" + serie);
                binary_img_link = (strain + "/binary/" + series_u + ".png").replace("20110826-","");
                serie = serie + 1;
                $('#tr2').html('<a href="' + strain + '/'+series_u+'" target="_blank"><img src="' + strain + '/'+series_u+'" style"=visibility: visible"></a>');
                $('#tr2b').html('<a href="'+binary_img_link+ '" target="_blank"><img src="'+binary_img_link + '" style"=visibility: visible"></a>');
		serie = 3;
                series_u = s2.replace(strain + "_1", strain+"_" + serie);
                binary_img_link = (strain + "/binary/" + series_u + ".png").replace("20110826-","");
                serie = serie + 1;
                $('#tr3').html('<a href="' + strain + '/'+series_u+'" target="_blank"><img src="' + strain + '/'+series_u+'" style"=visibility: visible"></a>');
                $('#tr3b').html('<a href="'+binary_img_link+ '" target="_blank"><img src="'+binary_img_link + '" style"=visibility: visible"></a>');
		if($('#vis_image').css("visibility")=='visible'){
			$('#vis_image img').each(function(){
				$(this).css("visibility",'visible');
			});
		}
		$("#"+this.id).addClass("selected_img");
		if (previousSelected != ""){
                	$(previousSelected).removeClass("selected_img");        
                }
                previousSelected = "#" + this.id;
		$('#visImage').click();
	});//.click
	});//each
	var img_re=/[A-Z][0-9]{0,2}_[A-Z][a-zA-Z0-9]_[0-9]_([0-9]{0,3})\.jpg$/;
	img_min=img_re.exec(datas[0])[1];
	var img_max=img_re.exec(datas[datas.length-1])[1];
	$('#img_span').text('/'+img_max);
}; //EOF carouselLoad
	
$('.scroll-content').mousewheel(function(event, delta, deltaX, deltaY){
	var v=scrollbar.slider('value');
	if(delta <0){
		v=v+6;
	}
	else if (delta >0){
		v=v-6;
	}
	scrollbar.slider('value',v);
	return false;
});

console.log("done retieving initial images" +new Date());
});//EOF $();


//============================EOF==========================

