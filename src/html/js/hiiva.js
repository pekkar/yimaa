$(function(){
console.log("start retrieving initial image icons" + new Date());

$("#visPlay").button({
    icons: {
            primary: "ui-icon-play"
        },
    text: false
});

$("#visPause").button({
    icons: {
            primary: "ui-icon-pause"
        },
    text: false
});

$("#visStop").button({
    /*icons: {
            primary: "ui-icon-stop"
        },*/
    text: true
});

$('#stats').append('<select id="timelag" class="tooltip"> <option value=3>3</option><option value = 5>5</option><option value = 10>10</option><option value = 20>20</option> <option value=0 selected=true>All</option> </select> <div id="dataDiv"><span id="dataCounter"></span></div>' );
$('#dataDiv').css('display', 'inline');
$("#timelag").multiselect({
    noneSelectedText: 'Choose dataset',
    minWidth: '160',
    header: false,
    selectedList: 1,
    multiple: false,
    classes: "timelag",
    open: function(){     
        clearInterval(interval_id);
        scatter_paused = true;
    }
   /* close: function(){
        if (sChart.series.length < 1){
            initScatter();
        }
        else{
            scatterAnimationContinue(sChart);
        }
    }*/
});

//var yimaa_mode = 'chart';
var yimaa_mode='PCA';
var previousSelected = "";
var pca_experiments = [];
var chart_experiments = [];
var dtSetStr = "";
var dtSetStrPCA = "";

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

var retrieve_exp_url='/cgi-bin/retrieve_experiment_series.pl';
var post_url="/cgi-bin/retrieve_experiment_features.pl";

$.getJSON('header_lowercase.json',function(datas){
	$('#tab_navigation').append('<select id="features" <span title="Image Classification Features - See Info Features for more Info" class="tooltip"></span> ');
	$('#tab_navigation').append('<select id="dtSet" title="Natural Variation Experiments" multiple="multiple">');
	//$('#dtSet').label("Strain");
	var i;
	for(i=0;i<datas.length;i+=1){
		$('#tab_navigation > #features').append(function(d){
				return '<option value="'+datas[i]+'">'+datas[i]+'</option>';
		})
	}
	 $("#features").multiselect({
        noneSelectedText: 'Dataset',
        minWidth: '140',
        header: false,
	selectedList: 1,
        multiple: false,
	classes: 'features', 
        click: uploadNewData
    });
});

$('#stats1').append(
	//'Feature <span id="selected_feature"></span>'+
        '<span>Timeframe: <input type="text" id="frame_span"></input> Image: <input type="text" id="image_span"></input></span>'+
        '<span id="series0">Series1:</span> '+
        '<span id="series1">Series2:</span> '+
        '<span id="series2">Series3:</span> '+
//'<br>Average: <span class="dtls_span" id="average"></span>'+
	'Min: <span id="min"></span> '+'Mean: <span id="mean"></span> '+ 'Max: <span id="max"></span>' 
	//'<br>'+
	//'Image: <input type="text" id="image_span"></input><span id="img_span"><span>'+
	
);


//$('#stats2').append('<ul>');
/*$('#stats2').append('<p>'+
	'<span class="dtls_span" >Time frame: <input type="text" id="frame_span"></input></span>'+
	'<span class="dtls_span" id="series0">Series1 value:</span>'+
	'<span class="dtls_span" id="series1">Series2 value:</span>'+
	'<span class="dtls_span" id="series2">Series3 value:</span>'+
	'</p>'
);*/
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
	var div = "#tr";
        var serie = 1;
        var img_link = strain + "/" + strain + "_" + serie + "_" + imgc + ".png";
        var binary_img_link = (strain + "/binary/" + strain + "_" + serie + "_" + imgc + ".png").replace("20110826-","");
        serie = serie + 1;
        $(div + '1').html('<a href="' + img_link + '" target="_blank"><img src="' + img_link + '" style"=visibility: visible"></a>');
        $(div + '1b').html('<a href="'+binary_img_link+ '" target="_blank"><img src="'+binary_img_link + '" style"=visibility: visible"></a>');
        img_link = strain + "/" + strain + "_" + serie + "_" + imgc + ".png";
        binary_img_link = (strain + "/binary/" + strain + "_" + serie + "_" + imgc + ".png").replace("20110826-","");
        $(div + '2').html('<a href="' + img_link + '" target="_blank"><img src="' + img_link + '" style"=visibility: visible"></a>');
        $(div + '2b').html('<a href="'+binary_img_link+ '" target="_blank"><img src="'+binary_img_link + '" style"=visibility: visible"></a>');
        serie = serie + 1;
        img_link = strain + "/" + strain + "_" + serie + "_" + imgc + ".png";
        binary_img_link = (strain + "/binary/" + strain + "_" + serie + "_" + imgc + ".png").replace("20110826-","");
        $(div + '#3').html('<a href="' + img_link + '" target="_blank"><img src="' + img_link + '" style"=visibility: visible"></a>');
        $(div + '#3b').html('<a href="'+binary_img_link+ '" target="_blank"><img src="'+binary_img_link + '" style"=visibility: visible"></a>');
        if($('#vis_image').css("visibility")=='visible'){
                $('#vis_image img').each(function(){
                        $(this).css("visibility",'visible');
                });
        }
        $('#img_strain_list').html(
                '<span title="Comp Strain List" class="tooltip">' + strain +  ' vs </span>' + getCmpStrainList());
        $("#cmp_strain_list").multiselect({
        minWidth: '160',
        noneSelectedText: "Compare with",
	header: "Compare strain",
        selectedList: 1,
        multiple: false,
        click: function(event, ui){
                var strain = ui.value;
                $('#cmp_strain').html("<br>" + strain + " timeseries " + imgc);
                loadCmpImages("#trc", strain, imgc);
        }
        });
}

function loadCmpImages(div, strain, imgc){
        var serie = 1;
        var img_link = strain + "/" + strain + "_" + serie + "_" + imgc + ".png";
        var binary_img_link = (strain + "/binary/" + strain + "_" + serie + "_" + imgc + ".png").replace("20110826-","");
        serie = serie + 1;
        $(div + '1').html('<a href="' + img_link + '" target="_blank"><img src="' + img_link + '" style"=visibility: visible"></a>');
        $(div + '1b').html('<a href="'+binary_img_link+ '" target="_blank"><img src="'+binary_img_link + '" style"=visibility: visible"></a>');
        img_link = strain + "/" + strain + "_" + serie + "_" + imgc + ".png";
        binary_img_link = (strain + "/binary/" + strain + "_" + serie + "_" + imgc + ".png").replace("20110826-","");
        $(div + '2').html('<a href="' + img_link + '" target="_blank"><img src="' + img_link + '" style"=visibility: visible"></a>');
        $(div + '2b').html('<a href="'+binary_img_link+ '" target="_blank"><img src="'+binary_img_link + '" style"=visibility: visible"></a>');
        serie = serie + 1;
        img_link = strain + "/" + strain + "_" + serie + "_" + imgc + ".png";
        binary_img_link = (strain + "/binary/" + strain + "_" + serie + "_" + imgc + ".png").replace("20110826-","");
        $(div + '#3').html('<a href="' + img_link + '" target="_blank"><img src="' + img_link + '" style"=visibility: visible"></a>');
        $(div + '#3b').html('<a href="'+binary_img_link+ '" target="_blank"><img src="'+binary_img_link + '" style"=visibility: visible"></a>');
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

//$('button.ui-multiselect').click(initScatter);
	
//================DIVS====================================
/*
$('#visImage').click(function(){
	//$('#plot1').css("display","none");
	//$('#PCAdiv').css("display","none");
	
        $('.dd').each(function(ind,ele){
		$(ele).css("display","none");
	})
	$('#vis_image img').each(function(i,e){
		$(e).css("visibility","visible");
	});
	$('#vis_image').css("display","inline");
	$('.pcacb').css("display","none");
});
*/
function interactImage(){
	$('.dd').each(function(ind,ele){
                $(ele).css("display","none");
        })
        $('#vis_image img').each(function(i,e){
                $(e).css("visibility","visible");
        });
        $('#vis_image').css("display","inline");
        $('.pcacb').css("display","none");
}


$('#visChart').click(function(){
   $('#dtSet').html(dtSetStr);
    scatterAnimationStop();
    scatter_paused = true;
    $('#visPause').css("display", "none");
    $('#visPlay').css("display", "none");
    $('#visStop').css("display", "none");
    $('#dataDiv').css("display", "none");
    $('#stats1').css('display', 'inline')
    $('.timelag').css("display", "none");
	$('.features').css("display","");
	$('#plot1').css("display","inline");
	$('.dd').each(function(ind,ele){
		$(ele).css("display","inline");
	});
	$('#pca_cb_div').css("display","none");
	$('#vis_image').css("display","none");
	$('#PCAdiv').css("display","none");
	$('.pcacb').css("display","none");
    $("#dtSet").multiselect('option', {multiple: false, open: function(event, ui){
        clearInterval(interval_id);
        $("#dtSet").multiselect("uncheckAll");}
    });
    $("#dtSet").multiselect('option', {multiple: false, open: function(event, ui){
        $("#dtSet").multiselect("uncheckAll");}
    });
	yimaa_mode='chart';
});

$('#PCAdiv').css("display","none");
$('#pca_cb_div').css("display","none");

$('#visPCA').click(function(){
     //$('#dtSet').html(dtSetStrPCA);
	$('#dtSet').html(dtSetStrPCA);
    $('#visPause').css("display", "inline");
    $('#visPlay').css("display", "inline");
    $('#visStop').css("display", "inline");
	$('#PCAdiv').css("display","inline");
    $('#stats1').css('display', 'none')
	$('#plot1').css("display","none");
	$('#vis_image').css("display","none");
	$('.features').css("display","none");
	$('#pca_cb_div').css("display","inline");
	$('.pcacb').css("display","inline");
	$('button.pcacb').css("display","inline");
	yimaa_mode = 'PCA';

    $("#dtSet").multiselect('option', {multiple: true, open: function(event, ui){clearInterval(interval_id);}});
    $('.timelag').css('display', '');
    $('#dataDiv').css('display', 'inline');

	initScatter();
});

var scatter_paused = false;

$('#visPause').click(function(){
    clearInterval(interval_id);
    scatter_paused = true;
    });

$('#visPlay').click(function(){
    if (scatter_paused){
        var val_arr = $('#dtSet').multiselect('getChecked');
        var strain = '';
        for (var i = 0; i < val_arr.length; i++){
            strain = strain + val_arr[i].value + ',';
        }
        if (sChart.series.length < 1){
            initScatter(strain.substring(0,strain.length-1));
        }
        else{
            if(scatterData[0]['dt'].length-1 === data_counter){
                                scatterAnimationStop();    
                initScatter(strain.substring(0,strain.length-1));
            }
            else{
                scatterAnimationContinue(sChart);
            }
        }
    }
});

$('#visStop').click(function(){
    scatterAnimationStop();
    scatter_paused = true;
});

function getCmpStrainList(){
        return '<select id="cmp_strain_list"  multiple="multiple">' + dtSetStr + '</select>';
}

//========================END==========================================
var carouselItems;
var hchart;
var sChart;
var hoptions;
var scrollbar;
var img_min;
var pcaSummary = '<option value="F29_Summary">'+"F29_Summary"+'</option>'
                         + '<option value="F45_Summary">'+"F45_Summary"+'</option>'
		+ '<option value="YAD145_Summary">'+"YAD145_Summary"+'</option>'
		+ '<option value="YO779_Summary">'+"YO779_Summary"+'</option>';
var strain = $('#dtSet').val();
if (strain === undefined || strain === ""){
	strain = "F29_A1";
}

$.getJSON(retrieve_exp_url, {exp:strain}, function(exp_icons){
//$.getJSON(imagepl, function(datas){
	carouselItems=exp_icons;
	initCallbackFunction(strain);
	carouselLoad(strain, exp_icons);
});

$.getJSON('/cgi-bin/retrieve_experiments.pl', function(datas){
	for(var l=0;l<datas.length;l++){
                $('#dtSet').append(function(d){
                        if (l === 0) {
                                dtSetStr = dtSetStr + '<option value="'+datas[l]+ '" selected="selected">'+datas[l]+'</option>';                          
                                return '<option value="'+datas[l]+'" selected="selected">'+datas[l]+'</option>';
                        }
                        dtSetStr = dtSetStr + '<option value="'+datas[l]+'">'+datas[l]+'</option>';
                        return '<option value="'+datas[l]+'">'+datas[l]+'</option>';
                })
        }
        dtSetStrPCA = dtSetStr + pcaSummary;
	$('#dtSet').html(dtSetStrPCA);
	//$('#dtSet').html(dtSetStr);  
  $("#dtSet").multiselect({
        noneSelectedText: 'Dataset',
        minWidth: '140',
	    selectedList: 3,
        header: false,
        multiple: true,
        classes: "dtSet",
        click: function(event, ui){
        	var strain = ui.value;
		var currentSelections = $('#dtSet').multiselect('getChecked');
		if (yimaa_mode === 'chart'){
        	//var retrieve_exp_url='/cgi-bin/retrieve_exp.pl';       
			$.getJSON(retrieve_exp_url, {exp:strain}, function(datas){
        			carouselItems=datas;
        			//initCallbackFunction();
        			carouselLoad(strain, datas);
				uploadNewData();
			});			
        	}
		if (yimaa_mode === 'PCA'){
			if (currentSelections.length == 0){
				//alert("empty - do nothing");
				return;
			}
			var val_arr = currentSelections; //$('#dtSet').multiselect('getChecked');
			var strain = '';
			for (var i = 0; i < val_arr.length; i++){
				strain = strain + val_arr[i].value + ',';
			}
        	scatterAnimationStop();
        	$('#timelag').val(0);
        	$('#timelag').multiselect("refresh");
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
	//experiments = 'F29_A1';
	if (experiments === undefined)
		experiments = 'F29_A1';
        experiments = experiments.replace(/20110826-/g, "");

	//var post_url="/cgi-bin/retrieve_pca.pl";
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
			zoomType:'xy',
            events:{
                load: function() {
                    scatterAnimationContinue(this);
                }
            }
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
							enabled: false,//true,
							radius:'1',
							lineColor:'rgb(100,100,100)'
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
									$('#series'+j).text("Series"+(j+1)+": "+scatterData[j]['dt'][i]['y']);
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
					    	if (previousSelected != ""){
							$(previousSelected).removeClass("selected_img");
						}	
                                            $("#" + strain + "_1"  + "_" + imgc).addClass("selected_img");
						getYiiImages(strain, imgc);
						previousSelected = "#" + strain + "_1"  + "_" + imgc;
                                                interactImage();//$('#visImage').click();
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
	$.getJSON("/cgi-bin/retrieve_pca.pl",{experiments:experiments, ca:c1id, cb:c2id} ,function(dts){
		var j;
		scatterData=dts;
		for(j=0;j<dts.length;j++){
		sOptions.series.push({	data:[dts[j]['dt'][0]]});
				//sOptions.series[j].name=j+1;
				//sOptions.series[j].data=dts[j]['dt'];	
			}
	    sChart = new Highcharts.Chart(sOptions);
	});
};

function uploadNewData(){
	if($('#PCAdiv').css("display")==='inline'){
		initScatter(null);
		return;
	}
	//var t=$('#features option:selected ')[0].value;
	var featureSelected = arguments[1].text;
	var t2 = $('#dtSet option:selected')[0].value;
		//var post_url="/cgi-bin/fluffy_features.pl";
		var minval,maxval;
		minval=10000;maxval=0;
		$.get(post_url,{feature:featureSelected, folder:t2},function(dts){
			var j;
			for(j=0;j<dts.length;j++){
				//no .setData(,false);
				hoptions.series[j].name=j+1;
				hoptions.series[j].data=dts[j]['dt'];	
				if(dts[j]['minv']['y']<minval) minval=dts[j]['minv']['y'];
				if(dts[j]['maxv']['y']>maxval) maxval=dts[j]['maxv']['y'];
			}
		hoptions.title={text:featureSelected};
		hchart.hideLoading();	
		hchart.destroy();
		hchart=new Highcharts.Chart(hoptions);
		});
	}

function initCallbackFunction(strain){
	console.log("init exp " + strain);
	$('#features option[value="area"]').attr('selected','selected');
	$('#dtSet').val(strain);
	$('#dtSet option[value="' + strain + '"]').attr('selected','selected');
	var t=$('#features option:selected ')[0].value;
	if (t == null)
		t = "area";
	$('#selected_feature').text(t);
	if(hchart) hchart.showLoading('Loading...');
		//var post_url="/cgi-bin/fluffy_features.pl";
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
							$('#series'+j).text("Series"+(j+1)+": "+dts[j]['dt'][i]['y']);
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
					    $("#" + strain + "_1"  + "_" + imgc).addClass("selected_img");
					    getYiiImages(strain, imgc);
						if (previousSelected != ""){
                                                        $(previousSelected).removeClass("selected_img");        
                                                }
                                                previousSelected = "#" + strain + "_1"  + "_" + imgc;
                				interactImage();//$('#visImage').click();
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
$('#visPCA').click();
};//EOF initCallbackFunction


function carouselHTML(strain, item){
	var img_re=/([A-Z][0-9]{0,2}_[A-Z][a-zA-Z0-9]_[0-9]_[0-9]{0,3})\.jpg$/;
	var aid=img_re.exec(item)[1];
	item = item.replace(".jpg", "");
	if (strain === "F29_A1" || strain === "F29_A3"){
		//http://yeastrepo.appspot.com/yimaa_image/F29_A3/20110826-F29_A3_3_312.jpg
		return '<img src="http://yeastrepo.appspot.com/yimaa_image/' + strain + '/'+item+'.jpg" id="'
        +item+'" width="75px" height="75px" class="scroll-content-item"/>'
        +'<p class="span_carousel"><span id='+item+'>'+aid+'</span></p>';
	}
	return '<img src="' + strain + '/icons/'+item+'" id="'
	+item+'" width="75px" height="75px" class="scroll-content-item"/>'
	+'<p class="span_carousel"><span id='+item+'>'+aid+'</span></p>';
};

/*
function imageHTML(item){
var img_re=/([A-Z][0-9]{0,2}_[A-Z][a-zA-Z0-9]_[0-9]_[0-9]{0,3})\.png$/;
var aid=img_re.exec(item)[1];
return '<img src="20110826-F29_A1'
+item+'" id="'
+item+'" alt="'+item+'"/>';
};
*/
function imageClick(){
	$('.scroll-content > img').each(function(){
		var s=this.id;
		var s2=s.replace("jpg","png");
		var serie = 1;
		$(this).click(function(){
            var tk = s.split("_");
            var counter = parseInt(tk[tk.length-1].split(".")[0]);
            getYiiImages(strain, counter);
            if($('#vis_image').css("visibility")=='visible'){
                $('#vis_image img').each(function(){
                    $(this).css("visibility",'visible');
                });
            }
            $("#"+this.id).addClass("selected_img");
            if (previousSelected !== ""){
                        $(previousSelected).removeClass("selected_img");        
                    }
                    previousSelected = "#" + this.id;
            interactImage();
            });//.click
	});//each

}
function carouselLoad(strain, datas){
	$('#scontentid').empty();
	var offDiv=4;
	var offsetEnd = datas.length/offDiv; //[3,5,8,10]; 

	function downloadIcons(i,offSet){
        for(i; i<offSet; i++){
            $('.scroll-content').append(carouselHTML(strain, datas[i]));
        }
        $('.scroll-content > img').mouseover(function(){
            var img_id=$(this).attr("id");
            var img_re=/([0-9]{0,3})$/;
            var aid=img_re.exec(img_id)[1];
            var b=aid.toString();
            b=b-img_min+1;
            var pnt=hchart.get(b);
            pnt.onMouseOver();
        }); //mouseover
        imageClick();
	}
	scrollbar=$('.scroll-bar').slider({
	//step:7, //evenly divisible by (max-min)
		slide: function(event,ui){
            console.log(ui.value);
			if($('.scroll-content').width() > $('.scroll-pane').width()){
				$('.scroll-content').css("margin-left",Math.round(
				ui.value / datas.length * ($('.scroll-pane').width()*2 - $('.scroll-content').width())
				) +'px');
			if(ui.value>offsetEnd-20){
				var j=offsetEnd;
				offsetEnd = ui.value + offsetEnd;   //datas.length/offDiv + offsetEnd;
                if(offsetEnd > datas.length){
                        offsetEnd = datas.length;
                }
				downloadIcons(j,offsetEnd);
			}
			}
			else{
				$('.scroll-content').css('margin-left',0);
			};
			
		},
		max: datas.length-1,
		min:0,
		step:Math.floor(datas.length/100),
		change: function(event,ui){
		        //console.log(ui.value);
            var carousel_change = Math.round(
					ui.value / datas.length * ($('.scroll-pane').width()*2 - $('.scroll-content').width())
				) +'px';
			if($('.scroll-content').width() > $('.scroll-pane').width()){
				$('.scroll-content').css("margin-left",carousel_change);
				if(ui.value>offsetEnd-20){
					var j=offsetEnd;
					offsetEnd = ui.value + offsetEnd; //datas.length/offDiv + offsetEnd;
                    if(offsetEnd > datas.length){
                        offsetEnd = datas.length;
                    }
					downloadIcons(j,offsetEnd);
				}
			}
			else{
				$('.scroll-content').css('margin-left',0);
			};
		}
	});
	var w=datas.length*(78);// + parseInt($('a img').css("margin-left") ) );
	$('.scroll-content').css("width",w); 
	console.log("start retieving " + strain + " image icons " +new Date());
	//length fluctuates around 400-500
	downloadIcons(0,offsetEnd);
	console.log("done retieving " + strain + " image icons " +new Date());  
	//for F29_A3, use GAE http://yeastrepo.appspot.com/yimaa_image/F29_A3/20110826-F29_A3_3_312.jpg

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
//console.log(v);
	return false;
});

var data_counter = 0;
var interval_id;

function scatterAnimationContinue(scatter_object){

    var series = scatter_object.series;
    var strain = $('#dtSet').val();
    var scatter_length = scatterData[0]['dt'].length;
    var time_skip = parseInt($('#timelag option:selected ')[0].value);
    if(time_skip === 0 ){
        for(j=0;j<scatterData.length;j++){
		    series[j].setData(scatterData[j]['dt'],false);
		}
        scatter_object.redraw();
        data_counter = scatter_length-1;
        var data_counter_txt = data_counter + "/" + (scatter_length -1);
        $("#dataCounter").text(data_counter_txt);

    }
    else{
    interval_id = setInterval(function() {
        
        for(var i=0; i<time_skip; i++){
            for (var index = 0; index < series.length; index++){
                series[index].addPoint(scatterData[index]['dt'][data_counter], false, false);
                }
            if(data_counter >= scatter_length-1){
                break;
            }
            data_counter = data_counter + 1;
        }
        if(scatter_length-1 <= data_counter){
            clearInterval(interval_id);
            console.log("Scatter plot done " + new Date());
        }
            if(data_counter > 88){
		$("#img_status").html(strain + " - timepoint:" + data_counter);
                getYiiImages(strain[0], data_counter);
		//interactImage();
            }else{
                 $("#img_status").html(strain + " does not have image data for timepoint " + data_counter);
             }
            var data_counter_txt = data_counter + "/" + (scatter_length -1);
            $("#dataCounter").text(data_counter_txt);
            scatter_object.redraw();
        
    }, 1500);
    }
    scatter_paused = false;
}

function scatterAnimationStop(){
    clearInterval(interval_id);
    data_counter = 0;
    while(sChart.series.length > 0){
        sChart.series[0].remove(false);
    }
    sChart.redraw();
}

	console.log("done retieving initial image icon" +new Date());
});//EOF $();


//============================EOF==========================

