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
});

$('#stats').append('<p><select id="strainDropDown"></select></p>');
var yimaa_mode='PCA';
var previousSelected = "";
var pca_experiments = [];
var chart_experiments = [];
var dtSetStr = "";
var dtSetStrPCA = "";
var sliderIMin = 0;
var sliderIMax = 0;
var currentTimeseries = 0;
var selectedTimepoint = 0;
var scatter_paused = false;
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

function originalStrain(){
	var selectedStrand=$(this).val();

	getYiiImages(selectedStran);
	$.getJSON(retrieve_exp_url, {exp:selectedStrand}, function(exp_icons){
	carouselLoad(selectedStrand, exp_icons);
	});
};
$('#tab_navigation').append('<p id="dtSetInfo" title="Dataset info"><span><A HREF="javascript:infoDialog()">Dataset Info</A></span>'+
	'<br><span id="visImage">Still Images</span></p>'
	);


//get feature headers
$.getJSON('data/header_lowercase.json',function(datas){
	$('#tab_navigation').append('<select id="features" <span title="Image Classification Features - See Info Features for more Info" class="tooltip"></span> ');
	$('#tab_navigation').append('<select id="dtSet" title="Natural Variation Experiments" multiple="multiple">');
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
        click: uploadNewFeature
    });
});

$('#stats1').append(
        '<span>Timeframe: <input type="text" id="frame_span"></input> Image: <input type="text" id="image_span"></input></span>'+
        '<span id="series0">Series1:</span> '+
        '<span id="series1">Series2:</span> '+
        '<span id="series2">Series3:</span> '+
	'Min: <span id="min"></span> '+'Mean: <span id="mean"></span> '+ 'Max: <span id="max"></span>' 
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

function getYiiImages(strain, imgc, callback){
	
	var div = "#tr";
        var serie = 1;
	//for summary strains, display A2 since that is the only replicate consistent in all 4 experiments
        if (strain.indexOf("_Summary") !== -1){
		strain = strain.replace("_Summary", "_A2")
	}
	var img_link = strain + "/" + strain + "_" + serie + "_" + imgc + ".png";
        var imgobj = new Image();
	//$("#image_container").css("width","400px");
	imgobj.src = img_link;
	imgobj.onload = function(){
		var mw = 25;
                if (imgobj.width*2 < 80){
                        mw = 120;
                }
		$("#image_container").css("width", (imgobj.width*2+mw)+"px");  
	}
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
        if($('#vis_image').css("visibility")==='visible'){
                $('#vis_image img').each(function(){
                        $(this).css("visibility",'visible');
                });
        }

	//strain=$('#strainDropDown').val();
	$('#img_status').html(strain +  ' timeseries ' + imgc);

	if( !$('#img_strain_list button.ui-multiselect')[0]){
        	$('#cmp_strain').html("<span id=cmpS>"+strain+ " timeseries </span><span id="+imgc+" class=times>"+imgc+"</span");
	}
	else{
		$('#cmp_strain .times').attr('id',imgc);
		$('#cmp_strain .times').text(imgc);
	}
	if( !$('#img_strain_list button.ui-multiselect')[0] || $('#strainDropDown').val() === strain){
	strain=$('#strainDropDown').val();
	$('#img_strain_list').html(
                '<span title="Comp Strain List" class="tooltip">' + $('#strainDropDown').val() +  ' vs </span>' + getCmpStrainList());
        $("#cmp_strain_list").multiselect({
        minWidth: '160',
        noneSelectedText: "Compare with",
	header: "Compare strain",
        selectedList: 1,
        multiple: false,
        click: function(event, ui){
                var strain = ui.value;
		var simg=$('#cmp_strain .times').attr('id');
		$('#cmp_strain #cmpS').text(strain+" timeseries ");
                loadCmpImages("#trc", strain, simg);
        }
        });
	};
	if (callback !== null) {
		callback();
	}
	selected_strain=$('#cmp_strain_list').val();
         //$('#cmp_strain').html(selected_strain + " timeseries " + imgc);
        loadCmpImages("#trc", selected_strain, imgc);
      //   $('#cmp_strain').html("<span id=cmpS>"+strain+ " timeseries</span><span id="+imgc+" class=times></span");
	 
}

function loadCmpImages(div, strain, imgc){
        //$("#cmp_image_container").css("display","block");
	var serie = 1;
        var img_link = strain + "/" + strain + "_" + serie + "_" + imgc + ".png";
        var binary_img_link = (strain + "/binary/" + strain + "_" + serie + "_" + imgc + ".png").replace("20110826-","");
        serie = serie + 1;
        $(div + '1').html('<a href="' + img_link + '" target="_blank"><img src="' + img_link + '" style"=visibility: visible"></a>');
        $(div + '1b').html('<a href="'+binary_img_link+ '" target="_blank"><img src="'+binary_img_link + '" style"=visibility: visible"></a>');
        img_link = strain + "/" + strain + "_" + serie + "_" + imgc + ".png";
        var imgobj = new Image();
        imgobj.src = img_link;
	//var iwidth = (imgobj.width*2 + 25);
        //$("#image_container").css("width", iwidth+"px");   
	imgobj.onload = function(){
		var ml = $("#image_container").width() + 800 + 20;
		$("#cmp_image_container").css("margin-left", (ml+"px"));
		var mw = 20;
		if (imgobj.width*2 < 80){
			mw = 120;
		}
		$("#cmp_image_container").css("width", (imgobj.width*2+mw)+"px");    
	}
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
function hideFeatures(){
	$('.dtSet').css('visibility','visible');
	$('#dtSetInfo').css('visibility','visible');
	$('#tab_navigation p').css('margin-left','470px');
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
	$('.timelag').css('display', '');
   	$('#dataDiv').css('display', 'inline');
	$('#stats p').css('display','block');
	$('#stillImages').css('display','none');
	$('#strainDropDown').css("margin-top","0px");
}

function hidePCA(){
	$('#dtSetInfo').css('visibility','visible');
	$('.dtSet').css('visibility','visible');
	$('#tab_navigation p').css('margin-left','610px');
	$('#strainDropDown').css("margin-top","0px");
	$('#visPause').css("display", "none");
	$('#visPlay').css("display", "none");
	$('#visStop').css("display", "none");
	$('#dataDiv').css("display", "none");
	$('#stats1').css('display', 'inline')
	$('.timelag').css("display", "none");
	$('.features').css("display","");
	$('#plot1').css("display","inline");
	$('#pca_cb_div').css("display","none");
	$('#vis_image').css("display","none");
	$('#PCAdiv').css("display","none");
	$('.pcacb').css("display","none");
 	$('#stillImages').css('display','none');
}

function hidePCAandFeatures(){
	$('#dtSetInfo').css('visibility','hidden');
	$('.dtSet').css('visibility','hidden');
	$('#visPause').css("display", "none");
	$('#visPlay').css("display", "none");
	$('#visStop').css("display", "none");
	$('#dataDiv').css("display", "none");
	$('.timelag').css("display", "none");
	$('.features').css("display","none");
	$('#pca_cb_div').css("display","none");
	$('#vis_image').css("display","none");
	$('#PCAdiv').css("display","none");
	$('.pcacb').css("display","none");
 	$('#stillImages').css('display','none');
	
	$('#plot1').css("display","none");
	$('#stats1').css('display', 'none')
	$('.pcacb').css("display","none");
	$('#pca_cb_div').css("display","none");
	$('#strainDropDown').css("margin-top","40px");
	$('#strainDropDown').css("display","inline");
	$('#strainDropDown').css("visibility","visible");
	$('#tab_navigation p').css('dispaly','none');
}
function interactImage(){
/*
console.log($('.dd'));
	$('.dd').each(function(ind,ele){
                $(ele).css("display","none");
        })
*/  
      $('#vis_image img').each(function(i,e){
                $(e).css("visibility","visible");
        });
        $('#vis_image').css("display","inline");
        $('.pcacb').css("display","none");
}

var fImageCount=151;
var nonfImageCount=108;

$('#dtSetInfo #visImage').click(function(){
	yimaa_mode='image';
	hidePCAandFeatures();
	$('#stillImages').css('display','inline');
	$('#stats #strainDropDown').off("change");
	$('#stats #strainDropDown').on('change',changeStill);

	$('option','#stats #strainDropDown').remove();
		var stillImages = new Array("fluffyroi","fluffybin","nonfluffybin","nonfluffyroi");
		stillImages.forEach(function(i,v){
			$('#stats #strainDropDown').append('<option value="'+i+'">'+i+'</option');
		});

//	when  <oth_mode> add slider content
	changeStill();

});

function changeStill(){
	var selectedfStrain=$('#strainDropDown').val();
	$('#scontentid').empty();
	var imgRe=/(non)/;
	if( imgRe.exec(selectedfStrain) ){
		stillSlider(selectedfStrain,nonfImageCount);
	}
	else{
		stillSlider(selectedfStrain,fImageCount);
	}
	var previousSel="";
	$('.scroll-content > img').click(function(){
		var ImgID=$(this)[0]['id'];
		var sStrain=ImgID.split(/\d+/)[0];
		var ImgNro=ImgID.replace(sStrain,"");
		var imageU="http://sumatranlehvi.cs.tut.fi/yimaa/images/";
		var img = new Image();
		img.src = imageU+sStrain+'/'+ImgNro;
		$('#stillImages').html('<a href="'+imageU+sStrain+'/'+ImgNro+'" target="_blank">'
		+'<img src="'+imageU+sStrain+'/'+ImgNro+'"/ class="stillGallery"></a>');
		//http://intianjora.cs.tut.fi/yimaa/images/fluffyroi/151.jpg
		$(this).addClass('selected_img');
		if(previousSel !=="" & previousSel !== "#"+this.id){
			$(previousSel).removeClass('selected_img');
		}
		previousSel="#"+this.id;
	});
};

function carouselStillHTML(fStrain, itemNro){
	var appspotURL='http://yeastrepo.appspot.com/yimaa_image/';//insert fluffyroi/<int>_icon.jpg
	appspotURL+=fStrain+'/'+itemNro+'_icon.jpg';
	/*if (fStrain == "F29_A1"){
		appspotURL = fStrain+'/'+itemNro+'_icon.jpg';
	}*/
	return '<img src="' + appspotURL+'" id="'
        +fStrain+itemNro+'" width="75px" height="75px" class="scroll-content-item2"/>';
};


function stillSlider(fStrain,fImageCount){
	$('.scroll-bar').slider('value', 0);
	$('#scontentid').empty();
	var w=fImageCount*90;
	$('.scroll-content').css("width",w+'px');
	for(var i=1;i<=fImageCount;i++){
		$('.scroll-content').append(carouselStillHTML(fStrain,i));
	}
}

$('#visChart').click(function(){
    $('.scroll-bar').slider('value', 0);
    if( $('#dtSet').val() !== null){
        if($('#dtSet').val() !== undefined && $('#dtSet').val()[0].indexOf('Summary') === -1){
            dtSetStr = dtSetStr.replace('selected="selected"', '');
            dtSetStr = dtSetStr.replace('value="'+$('#dtSet').val()[0]+'"', 'value="'+$('#dtSet').val()[0]+'" selected="selected"');
        }
        else{
            dtSetStr = dtSetStr.replace('selected="selected"', '');
            dtSetStr = dtSetStr.replace('value="F29_A3"', 'value="F29_A3" selected="selected"');

        }
    }
    $('#dtSet').html(dtSetStr);
    uploadNewFeature();
    scatterAnimationStop();
    scatter_paused = true;
	hidePCA();
	yimaa_mode='chart';
/*
 $('.dd').each(function(ind,ele){
		$(ele).css("display","inline");
	});
*/  
	 $("#dtSet").multiselect('option', {multiple: false, open: function(event, ui){
        	clearInterval(interval_id);
        	$("#dtSet").multiselect("uncheckAll");}
    	});

	$('#stats p').css('display','none');
	$.getJSON(retrieve_exp_url, {exp:strain}, function(datas){
        			carouselLoad(strain, datas);
			});
	
}); //EOF visChart.click;

$('#PCAdiv').css("display","none");
$('#pca_cb_div').css("display","none");


$('#visPCA').click(function(){
	if(yimaa_mode !== 'PCA'){
		$('option','#stats #strainDropDown').remove();
		initializeStrainDropDown();
	$.getJSON(retrieve_exp_url, {exp:strain}, function(datas){
        			carouselLoad(strain, datas);
			});
	}


$('#strainDropDown').off('change');
$('#strainDropDown').on('change',originalStrain);
    $('.scroll-bar').slider('value', 0);
    if( $('#dtSet').val() !== null){
        dtSetStrPCA = dtSetStrPCA.replace('selected="selected"', '');
        dtSetStrPCA = dtSetStrPCA.replace('value="'+$('#dtSet').val()+'"', 'value="'+$('#dtSet').val()+'" selected="selected"');
    }
    $('#dtSet').html(dtSetStrPCA);
	hideFeatures();
       $("#dtSet").multiselect('option', {multiple: true, open: function(event, ui){clearInterval(interval_id);}});
   ($('#dtSet').val() === null) ? initScatter() : initScatter($('#dtSet').val().toString());

	yimaa_mode = 'PCA';
});


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
	strain = "F29_A3";
}

/*
 * update retrieve_exp_url to return one replicate set, right now it's return exp_icons of all the files
 */
$.getJSON(retrieve_exp_url, {exp:strain}, function(exp_icons){
	initCallbackFunction(strain);
	carouselLoad(strain, exp_icons);
});

$.getJSON('/cgi-bin/retrieve_experiments.pl', function(datas){
	for(var l=0;l<datas.length;l++){
                $('#dtSet').append(function(d){
                        if (datas[l].indexOf("F29_A3") !== -1){//) === 0) {
                                dtSetStr = dtSetStr + '<option value="'+datas[l]+ '" selected="selected">'+datas[l]+'</option>';                          
                                return '<option value="'+datas[l]+'" selected="selected">'+datas[l]+'</option>';
                        }
                        dtSetStr = dtSetStr + '<option value="'+datas[l]+'">'+datas[l]+'</option>';
                        return '<option value="'+datas[l]+'">'+datas[l]+'</option>';
                })
        }
        dtSetStrPCA = dtSetStr + pcaSummary;
	$('#dtSet').html(dtSetStrPCA);
  $("#dtSet").multiselect({
        noneSelectedText: 'Dataset',
        minWidth: '200',
	selectedList: 3,
        header: false,
        multiple: true,
        classes: "dtSet",
        click: function(event, ui){
	$(this).blur();
	$(this).trigger('blur');
        	strain = ui.value;
		var val_arr = $('#dtSet').multiselect('getChecked');
		if (yimaa_mode === 'chart'){
			$.getJSON(retrieve_exp_url, {exp:strain}, function(datas){
        			carouselLoad(strain, datas);
				uploadNewFeature();
			});			
        	}
		if (yimaa_mode === 'PCA'){
			if (val_arr.length == 0)
				return;
			var exp = '';

		var previousStrain;
		previousStrain=$('#strainDropDown').val();
		$('option','#strainDropDown').remove();
		val_arr.each(function(i,v){
			$('#stats #strainDropDown').append('<option value="'+v.value+'">'+v.value+'</option');
		});
//console.log(strain+ ' '+$('#strainDropDown').val()+" "+previousStrain);
			if(strain !== $('#strainDropDown').val() || previousStrain !== $('#strainDropDown').val()){
				strain=$('#strainDropDown').val();
		   		$.getJSON(retrieve_exp_url, {exp:strain}, function(datas){
                               		carouselLoad(strain, datas);
		   		});
			}	
			if (val_arr.length === 1){
				$('.scroll-bar').slider('value', 0);
				for (var i = 0; i < val_arr.length; i++){
					exp = exp + val_arr[i].value + ',';
				}
        			scatterAnimationStop();
        			$('#timelag').val(0);
        			$('#timelag').multiselect("refresh");
				initScatter(exp.substring(0,exp.length-1));
			
			}else{
                                for (var i = 0; i < val_arr.length; i++){
                                        exp = exp + val_arr[i].value + ',';
                                }
                                scatterAnimationStop();
                                $('#timelag').val(0);
                                $('#timelag').multiselect("refresh");
                                initScatter(exp.substring(0,exp.length-1));
			}
						
		}
        },
        open: function(event, ui){
$(this).trigger('blur');
	$(this).blur();
            $("#dtSet").multiselect("uncheckAll");
		$('option','#strainDropDown').remove();
		var valarr = $('#dtSet').multiselect('getChecked');
		valarr.each(function(i,v){
			$('#stats #strainDropDown').append('<option value="'+v.value+'">'+v.value+'</option');
		});
	
        }
    });
});

var scatterData;
function initializeStrainDropDown(){
if ($('#strainDropDown').val() === undefined ||$('#strainDropDown').val() === null){
		$('#stats #strainDropDown').append('<option value="'+'F29_A3'+'">'+'F29_A3'+'</option');
	}
}
function initScatter(experiments){	
	if (experiments === undefined){
		experiments = 'F29_A3';
		//document.getElementById("strainDropDown").value = experiments;
	}
	initializeStrainDropDown();	
        experiments = experiments.replace(/20110826-/g, "");
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
		yAxis:{
			title:{text:'Principal Component Analysis'},
			labels: {
				align:'left',
				x:5,y:0
 			}
		},
		xAxis:{
			stratOnTick: true,
			endOnTick:true
		},
		legend:{
			borderWidth:0,
		},
		tooltip: {
                	formatter: function() {
                        	return this.point.strain.split(".")[0] +  '-Frame: ' + this.point.id + ' X:'+
                        	this.x +', Y:'+ this.y;
                	}
            	},
		plotOptions:{
			scatter:{
				marker:{radius:'1'},
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
									$('#series'+j).text("Replicate"+(j+1)+": "+scatterData[j]['dt'][i]['y']);
									pointsScatter.push(scatterData[j]['dt'][i])
								}
							}
						}		
					},//MOEOF Scatter
					click: function(eve){
						//add code to see which series was selected to figured out the right strain being []
						var imgc = this['id'];
						currentTimeseries = imgc;
						var yindex = Math.floor(this.series.index/3);
                                                var strain = $('#dtSet').val()[yindex]; //for multiple
						getYiiImages(strain, imgc, function(){
					    	if (previousSelected !== ""){
							$(previousSelected).removeClass("selected_img");
						}
							previousSelected = "#" + strain + "_1_" + imgc;
							selectedTimepoint = imgc;
							$('.scroll-bar').slider('value', imgc-(img_min));
							$(".scroll-content #" + strain + "_1_" + imgc).addClass("selected_img");
						console.log("Callback added strain " + strain + " css class to " + imgc + " min " + img_min);
						});
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
		sOptions.series.push({data:[dts[j]['dt'][0]],name:dts[j]['maxv']['strain']});
		}

	    sChart = new Highcharts.Chart(sOptions);
	});
};

function uploadNewFeature(){
	if($('#PCAdiv').css("display")==='inline'){
		initScatter(null);
		return;
	}
	var featureSelected = $('#features').val();
	if (featureSelected === null){
		featureSelected = 'area';
	}
	if (arguments[1] !== undefined){
		featureSelected = arguments[1].text;
    }
	//$('#features option:selected')[0].value;//arguments[1].text;
	var t2 = $('#dtSet option:selected')[0].value;
		var minval,maxval;
		minval=10000;maxval=0;
		$.get(post_url,{feature:featureSelected, folder:t2},function(dts){
			var j;
			for(j=0;j<dts.length;j++){
				//hoptions.series[j].name=j+1;
				hoptions.series[j].name=dts[j]['maxv']['strain'];	
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
function initializeSlider(dataIndex ,dataID){
	var spanText=dataID.substring(0, dataID.length-4);
	return '<div id="' + dataIndex + '" width="75px" height="75px" >'
	+'<p class="span_carousel2"><span>'+spanText+'</span></p>'
	+'</div>';
};
function initCallbackFunction(strain){
	console.log("init exp " + strain);
	$('#features option[value="area"]').attr('selected','selected');
	$('#dtSet').val(strain);
	$('#dtSet option[value="' + strain + '"]').attr('selected','selected');
	var t= $('#features').val();//$('#features option:selected ')[0].value;
	if (t === null)
		t = "area";
	$('#selected_feature').text(t);
	if(hchart) hchart.showLoading('Loading...');
		var j,minval,maxval;
		//console.log("Initial getting " + t + " time " + new Date());
		$.get(post_url,{feature:t, folder:strain},function(dts){
		//console.log("Returned from GET " + t + " time " + new Date());
	hoptions={
		chart: {
			renderTo:'plot1',
			type:'spline',
			borderColor:''
		},
		title:{
			text:"Feature:"+t
		},
		xAxis:{
			margin:[10,10,10,10],
			min:0
			//max:500
		},
		yAxis:{title:''},
		legend:{
			borderWidth:0,
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
								$('#series'+j).text("Replicate"+(j+1)+": "+dts[j]['dt'][i]['y']);
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
						currentTimeseries = imgc;
						var strain = $('#dtSet').val();//[] for multiple
						$("img#" + strain + "_1"  + "_" + imgc+".scroll-content-item").click();
					    getYiiImages(strain, imgc, function(){
					    	if (previousSelected !== ""){
                                            		$(previousSelected).removeClass("selected_img");        
                                            	}
                                                previousSelected = "#" + strain + "_1"  + "_" + imgc;
					        $(".scroll-content #" + strain + "_1_" + imgc).addClass("selected_img");
						previousSelected = "#" + strain + "_1_" + imgc;
						selectedTimepoint = imgc;
						$('.scroll-bar').slider('value', imgc-(img_min));
						$(".scroll-content #" + strain + "_1_" + imgc).addClass("selected_img");
						$('.scroll-bar').slider('value', (imgc-img_min));

						});//end getyii
					}}
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
				data:dts[j]['dt'],
				name:dts[j]['maxv']['strain']}
			);
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
	if (item === undefined){
	//	console.log("Item is undefined, selected timepoint is " + selectedTimepoint);
		$(".scroll-content #" + strain + "_1"  + "_" + selectedTimepoint).addClass("selected_img");
		return;
	}
	var aid=item.substring(0, item.length-4);
	
	if (strain === "F29_Summary")
		strain = "F29_A3";
	if (strain === "F45_Summary")
		strain = "F45_A2";
	if (strain === "YAD145_Summary")
                strain = "YAD145_A2";
	if (strain === "YO779_Summary")
                strain = "YO779_A2"
	item = item.replace(".jpg", "");
	item = item.replace("20110826-", "");
	var gaeurl = "http://yeastrepo.appspot.com/";
	if (strain.indexOf("YAD145") !== -1){
		gaeurl = "http://yeastimage.appspot.com/";
	}else if (strain === "F29_A1"){
		return '<img src="' + strain + '/icons/'+item+'.jpg" id="'+item+'" width="75px" height="75px" class="scroll-content-item"/>';
	}
	//$("#cmp_image_container").html("");
	return '<img src="' + gaeurl + 'yimaa_image/' + strain + '/'+item+'.jpg" id="'
        +item+'" width="75px" height="75px" class="scroll-content-item"/>'
};



function imageClick(){
	$('.scroll-content div > img').each(function(){
		var s=this.id;
		var s2=s.replace("jpg","png");
		var serie = 1;
	$(this).click(function(){
		    $(this).addClass('selected_img');
        	    var tk = s.split("_");
        	    var counter = parseInt(tk[tk.length-1].split(".")[0]);
        	    getYiiImages(strain, counter, null);
			if($('#vis_image').css("visibility")==='visible'){
        			$('#vis_image img').each(function(){
                			$(this).css("visibility",'visible');
                		});
			}
//Now deselecting the image is impossible but the img selection works otherwise;
            	if (previousSelected !== "" & previousSelected !== "#"+this.id){
                        $(previousSelected).removeClass("selected_img");        
                    }
                    previousSelected = "#" + this.id;
            //interactImage();
            });//.click
	});//each

}
function carouselLoad(strain, datas){
	$('.scroll-bar').slider('value', 0);
	$('#scontentid').empty();
	var w=datas.length*78;
	$('.scroll-content').css("width",w+'px');
	var offsetEnd; 
	var offSetWindow=35;
	for(var j2=0;j2<datas.length;j2++){
		$('.scroll-content').append(initializeSlider(j2, datas[j2]));
	};
	var itk = datas[0].split(".")[0].split("_");
	img_min = parseInt(itk[itk.length-1]);
	function downloadIcons(i,offSet){
		//console.log("downloading icons min:" + i + " max:" + offSet);
	        for(i; i<=offSet; i++){
			if($('#'+i+' img')[0]===undefined){
        			$('.scroll-content #'+i).append(carouselHTML(strain, datas[i]));
				//if (selectedTimepoint == i){
				//	$('.scroll-content #'+i).addClass("selected_img");
				//}
			}
        	}
        	$('.scroll-content div > img').mouseover(function(){
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
			if($('.scroll-content').width() > $('.scroll-pane').width()){
		var margin=parseInt($('.scroll-pane').css('margin-left'));
       	var carousel_change = Math.round(ui.value / datas.length * (($('.scroll-pane').width()+margin)*2 - $('.scroll-content').width())) +110+'px';

				$('.scroll-content').css("margin-left",carousel_change);
                                offsetEnd=ui.value+10;
				if(offsetEnd >= datas.length){
					offsetEnd=datas.length;
					downloadIcons(offsetEnd-offSetWindow,offsetEnd);	
				}
				else{
					downloadIcons(offsetEnd-offSetWindow,offsetEnd);
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
		var margin=parseInt($('.scroll-pane').css('margin-left'));
	var carousel_change = Math.round(ui.value / datas.length * (($('.scroll-pane').width()+margin)*2 - $('.scroll-content').width())) +110+'px';
			if($('.scroll-content').width() > $('.scroll-pane').width() & ui.value !== 0){
//console.log(carousel_change+' '+ui.value);
				$('.scroll-content').css("margin-left",carousel_change);
				offsetEnd = ui.value+10;
                                if(offsetEnd >= datas.length){
                                	offsetEnd = datas.length;
					downloadIcons(offsetEnd-offSetWindow,offsetEnd);
				}
				else{
					downloadIcons(offsetEnd-offSetWindow,offsetEnd);
				}
			}else{
				$('.scroll-content').css('margin-left',0);
			};
		}
	});
	console.log("start retieving " + strain + " image icons " +new Date());
	downloadIcons(0,offSetWindow);
	console.log("done retieving " + strain + " image icons " +new Date());  
	//var img_re=/[A-Z][0-9]{0,2}_[A-Z][a-zA-Z0-9]_[0-9]_([0-9]{0,3})\.jpg$/;
	//img_min=img_re.exec(datas[0])[1];
	var itk = datas[0].split(".")[0].split("_");
	img_min = parseInt(itk[itk.length-1]);
	var itk2 = datas[datas.length-1].split(".")[0].split("_");
	//var img_max=img_re.exec(datas[datas.length-1])[1];
	var img_max = parseInt(itk2[itk2.length-1]);
	$('#img_span').text('/'+img_max);
}; //EOF carouselLoad
	
$('.scroll-content').mousewheel(function(event, delta, deltaX, deltaY){
	var v=scrollbar.slider('value');
	if(delta<0){
		v=v+6;
	scrollbar.slider('value',v);
	}
	else{
		v=v-6;
	scrollbar.slider('value',v);
	}
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
		//$("#img_status").html(strain + " - timepoint:" + data_counter);
                getYiiImages(strain[0], data_counter,null);
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

function infoDialog(){
	new Messi('Haploid progeny from a cross between a Sake brewing strain and a White Tecc brewing strain<br>Phenotype Fluffy/NonFluffy<br>his3D1 leu2D0 met15D0 ura3D0<br><br>All rights reserved, please contact <a href="ttps://www.systemsbiology.org/dudley-group" target="_blank">Dudley Group</a> for more information',
        {
            title: 'Strain Info',titleClass:'Info',height:'175px',width:'200px', center:false, viewport:{top:'175px',left:'800px'}
    });
}

//============================EOF==========================

