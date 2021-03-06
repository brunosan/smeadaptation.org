var region_id="none";

function readRegions(){
	var out = [];
    $.ajax({
        'async': false,
        'global': false,
        'url': '/lib/default-regions.json',
        'dataType': "json",
        'success': function (data) {
			for(var key in data){
				  out.push({"Code":key,"Name":data[key]["name"]});
			}
        }
    });
	return out;
}

function readDefaults(id){
	    region_id=id;
		var json = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': '/lib/default-regions.json',
	        'dataType': "json",
	        'success': function (data) {
	            json = data;
	        }
	    });
	 	_gaq.push(['_trackEvent', "Load_region",id]);
	    return json[id];
}
function classDefault(id){
	dic={"Low":"btn-success","Medium":"btn-warning","High":"btn-danger",
		 "low":"btn-danger","medium":"btn-warning","high":"btn-success",
		 "Positive":"btn-success","Neutral":"","Negative":"btn-danger",
		"Good":"btn-success","Moderate":"btn-warning","Bad":"btn-danger",
		"Moderate":"btn-warning","Strong":"btn-danger"};
	return dic[id];
}
function selectRegion(id){
	var vals= readDefaults(id);

	$("#region-def").val(vals.name);
	$("#region-info").html("[Using default values for Region]");
	for(var section in vals){
		for(var key in vals[section]){
			$('#'+section+'-'+key).val(vals[section][key])
			.removeClass('btn-success btn-warning btn-danger')
			.addClass(classDefault(vals[section][key]));
	  	 }
	}
	countResults();
}
function applyClass(){
	var id=event.target.id;
	var id_val=$("#"+event.target.id).val();
	$("#"+id).removeClass('btn-success btn-warning btn-danger').addClass(classDefault(id_val));
	$("#region-info").html("[Customized region]");
	countResults();
	_gaq.push(['_trackEvent', "Driver",'change_'+region_id+"-"+id+"-"+id_val]);
    //_trackEvent(category, action, opt_label, opt_value, opt_noninteraction)
}

function countBlock(block,sectors,key){
	var count=0;
	for(var j = 0; j < block.length; j++){
	for(var i = 0; i < sectors.length; i++){
		if($('#'+block[j]+'-'+sectors[i]).val() == key){
			count++;
		}
	}
	}
	return count;
}

function countResults(){
	//Vulnerability
	var sectors=["energy","water","food","infra","health"];
	var vul_overal=0;
	var sector_overall_Lows=0;
	var sector_overall_Moderates=0;
	var sector_overall_Strongs=0;
	for(var m = 0; m < sectors.length; m++){
		var sector=[sectors[m]];
		block=["Natural_disasters","Precipitation_change","Drought","Sea_level_rise","Overconsumption"]
		var Lows = countBlock(block,sector,"Low");
		var Moderates = countBlock(block,sector,"Moderate");
		var Strongs = countBlock(block,sector,"Strong");
		sector_overall_Lows+=Lows;
		sector_overall_Moderates+=Moderates;
		sector_overall_Strongs+=Strongs;
		var Drivers_av=(Lows*1+Moderates*2+Strongs*3)/block.length;
		block=["Condition"];
		var Current= countBlock(block,sector,"Good")*(-3)+countBlock(block,sector,"Bad")*3;
		block=["dependency"];
		var Dependency= countBlock(block,sector,"Neutral")*(0)+
						countBlock(block,sector,"Low")*1+
						countBlock(block,sector,"Medium")*2+
						countBlock(block,sector,"High")*3;
		//set badges
		var overall="";
		var score= Dependency * (Current+Drivers_av);
		vul_overal+=score;
		block="Vulnerability";
		$("#"+block+"-"+sector+"-low").text(Lows).attr("title","Low Drivers").tooltip();
   		$("#"+block+"-"+sector+"-medium").text(Moderates).attr("title","Moderate Drivers").tooltip();
   		$("#"+block+"-"+sector+"-high").text(Strongs).attr("title","Strong Drivers").tooltip();
		if (score > 0){
			overall="High ("+score.toFixed(2)+")";
		}else{
			overall="Low ("+score.toFixed(2)+")";
		}
		$("#"+block+"-"+sector+"-overall").text(overall)
			.attr("title","Current - Drivers_average= "+score.toFixed(2));
	};	//end sectors
	
	$("#Vulnerability-perception-low").text(sector_overall_Lows)
								      .attr("title","Low Drivers").tooltip();
	$("#Vulnerability-perception-medium").text(sector_overall_Moderates)
										 .attr("title","Moderate Drivers").tooltip();
	$("#Vulnerability-perception-high").text(sector_overall_Strongs)
									   .attr("title","Strong Drivers").tooltip();
	
	var overall_score=vul_overal/sectors.length;
	var vulnerability=overall_score;
	var overall=""
	if (overall_score > 0){
		overall="High ("+overall_score.toFixed(2)+")";
	}else{
		overall="Low ("+overall_score.toFixed(2)+")";
	}
	$("#Vulnerability-perception-overall").text(overall)
		.attr("title","Average across sectors= "+overall_score.toFixed(2));
	$("#Vulnerability-nav-overall").text(overall)
		.attr("title","Average across sectors= "+overall_score.toFixed(2));
	//Readiness
	var sector=["perception"];
	block=["Government_transparency","Fairness_in_starting_a_business","Satisfaction_with_state_regulations",
	"Use_of_internet_in_starting_a_business","Ease_of_enforcing_contracts","Degree_of_labor_force_education"]
	var Lows = countBlock(block,sector,"low");
	var Moderates = countBlock(block,sector,"medium");
	var Strongs = countBlock(block,sector,"high");
	var Drivers_av=(Lows*1+Moderates*2+Strongs*3)/block.length;
	//set badges
	var overall="";
	var score= Drivers_av;
	block="Readiness";
	$("#"+block+"-"+sector+"-low").text(Lows).attr("title","Low Drivers").tooltip();
	$("#"+block+"-"+sector+"-medium").text(Moderates).attr("title","Moderate Drivers").tooltip();
	$("#"+block+"-"+sector+"-high").text(Strongs).attr("title","Strong Drivers").tooltip();
	if (score > 1.5){
		overall="High ("+score.toFixed(2)+")";
	}else{
		overall="Low ("+score.toFixed(2)+")";
	}
	$("#"+block+"-"+sector+"-overall").text(overall)
		.attr("title","Drivers_average= "+score.toFixed(2));
	$("#Readiness-nav-overall").text(overall)
			.attr("title","Average across sectors= "+score.toFixed(2));
	var readiness=score;
	matrix(readiness,vulnerability);
}

var regions= readRegions();
$("#regions").typeahead({
    source: function (query, process) {
        regions = [];
	    map = {};
	    var data = readRegions();
	    $.each(data, function (i, state) {
	        map[state.Name] = state;
	        regions.push(state.Name);
	    });
	    process(regions);
    },
    updater: function (item) {
        selectRegion(map[item].Code);
	    return item;
    },
    matcher: function (item) {
        if (item.toLowerCase().indexOf(this.query.trim().toLowerCase()) != -1) {
	        return true;
	    }
    },
    sorter: function (items) {
        return items.sort();
    },
    highlighter: function (item) {
        var regex = new RegExp( '(' + this.query + ')', 'gi' );
	    return item.replace( regex, "<strong>$1</strong>" );
    },
});

$('#smesector').click(function () {  
   _gaq.push(['_trackEvent', 'SME_activity',$('#smesector_value').val()]);
  	$('#smesector').addClass('btn-success');
});

function loadExample(){
	selectRegion("NL");
	value="Low";
	$("#dependency-energy").val(value)
	.removeClass('btn-success btn-warning btn-danger')
	.addClass(classDefault(value));
	$("#dependency-water").val("High")
	.removeClass('btn-success btn-warning btn-danger')
	.addClass(classDefault(value));
	value="High";
	$("#dependency-infra").val(value)
	.removeClass('btn-success btn-warning btn-danger')
	.addClass(classDefault(value));
	value="Medium";
	$("#dependency-food").val(value)
	.removeClass('btn-success btn-warning btn-danger')
	.addClass(classDefault(value));
	value="Neutral";
	$("#dependency-health").val(value)
	.removeClass('btn-success btn-warning btn-danger')
	.addClass(classDefault(value));
	countResults();
	$('#smesector_value').val("Beverage company")
	$('#smesector').addClass('btn-success');
	 //_gaq.push(['_setCustomVar',1,'Load_example', "NL",3 ]);
	_gaq.push(['_trackEvent', 'Load_example', "NL"]);
}

//D3 matrix graph
function matrix(readiness,vulnerability){
	var width = 350,
    height = 350, 
    margin = 50;

d3.select('#flag').remove();
var svg=d3.select("#rv-chart").append("svg").attr("width",width).attr("height",height).attr("id","flag");
var x=d3.scale.linear().domain([0,3]).range([margin,width-margin]);
var y=d3.scale.linear().domain([-6,6]).range([height-margin,margin]);

function c(readiness,vulnerability){
	color="";
	if (vulnerability<0){
		if (readiness<1.5){
			color="yellow";
		}else{
			color="green";
		}
	}else{
		if (readiness<1.5){
			color="blue";
		}else{
			color="red";
		}
	}
	return color;
}

var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left");


svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + (height - margin) + ")")
  .call(xAxis)	
  .append("text")
    .attr("class", "label")
    .attr("x", 300)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("Readiness");

svg.append("g")
  .attr("class", "axis")
   .attr("transform", "translate(" + margin + ",0)")
  .call(yAxis)	
  .append("text")
     .attr("class", "label")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("x", -206)
     .attr("dy", ".71em")
     .style("text-anchor", "end")
     .text("Vulnerability")


svg.selectAll(".h").data(d3.range(-6,6,6)).enter()
  .append("line").classed("h-d3",1)
  .attr("x1",margin).attr("x2",height-margin)
  .attr("y1",y).attr("y2",y)
  
svg.selectAll(".v").data(d3.range(0,3,1.5)).enter()
  .append("line").classed("v-d3",1)
  .attr("y1",margin).attr("y2",width-margin)
  .attr("x1",x).attr("x2",x)
  

var country=["SME"];

svg.selectAll("circle").data(country).enter()
  .append("circle")
  .attr("cx",x(readiness))
  .attr("cy",y(vulnerability))
  .attr("r",10)
  .style("fill",c(readiness,vulnerability))
  .style("opacity",0.5)
  .style("stroke","black")
  .style("stroke-width",1)
  .append("title")
  .text(String);
}