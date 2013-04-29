function readRegions(){
	var out = [];
    $.ajax({
        'async': false,
        'global': false,
        'url': '/lib/default-regions.json',
        'dataType': "json",
        'success': function (data) {
			 /*[
			        {"Code": "CA", "Name": "California"},
			        {"Code": "NL", "Name": "Nuevo Leon"},
			    ]*/
			for(var key in data){
				  out.push({"Code":key,"Name":data[key]["name"]});
			}
        }
    });
	return out;
}

function readDefaults(id){
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
	    return json[id];
}
function classDefault(id){
	dic={"Low":"btn-success","Medium":"btn-warning","High":"btn-danger",
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
	var id=$("#"+event.target.id).val();
	$("#"+event.target.id).removeClass('btn-success btn-warning btn-danger').addClass(classDefault(id));
	$("#region-info").html("[Customized region]");
	countResults();
}

function countResults(){
	var vals= readDefaults("NL"); //read only to get blocks
	var sectors=["energy","water","food","infra","health","perception"];
	var items=["Low","Medium","High","Positive","Negative","Good","Moderate","Bad"];
	for(var i = 0; i < sectors.length; i++){
		var Lows = Mediums = Highs = Positives = Neutrals = Negatives = Goods = Moderates = Bads= 0;
		for(var block in vals){
			switch($('#'+block+'-'+sectors[i]).val()){				
				case "Low":
					Lows++;
					break;
				case "Medium":
					Mediums++;
					break;		
				case "High":
					Highs++;
					break;
				case "Good":
					Goods++;
					break;
				case "Moderate":
					Moderates++;
					break;
				case "Bad":
					Bads++;
					break;
				case "Positive":
					Positives++;
					break;
				case "Negative":
					Negatives++;
					break;
				
			}//switch		
	  	 }//section vals
		//set badges for this sector
		var blocks = ["vulnerability","readiness"];
		var overall="";
	    for(var j = 0; j < blocks.length; j++){
			$("#"+blocks[j]+"-"+sectors[i]+"-low").text(Lows+Positives+Goods);
	    	$("#"+blocks[j]+"-"+sectors[i]+"-medium").text(Mediums+Moderates);
	    	$("#"+blocks[j]+"-"+sectors[i]+"-high").text(Highs+Negatives+Bads);
			if (Lows+Positives < Highs+Negatives){
				overall="High";
			}else{
				overall="Low";
			}
			$("#"+blocks[j]+"-"+sectors[i]+"-overall").text(overall);
		}//for blocks badges
	}//for sectors
	
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



//D3 matrix graph
var width = 350,
    height = 350, 
    margin = 50;

var svg=d3.select("#rv-chart").append("svg").attr("width",width).attr("height",height);
var x=d3.scale.linear().domain([0,5]).range([margin,width-margin]);
var y=d3.scale.linear().domain([-10,10]).range([height-margin,margin]);


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


svg.selectAll(".h").data(d3.range(-8,10,2)).enter()
  .append("line").classed("h-d3",1)
  .attr("x1",margin).attr("x2",height-margin)
  .attr("y1",y).attr("y2",y)
  
svg.selectAll(".v").data(d3.range(1,5)).enter()
  .append("line").classed("v-d3",1)
  .attr("y1",margin).attr("y2",width-margin)
  .attr("x1",x).attr("x2",x)
  
var GERD=[2.5];
var growth=[0];
var GDPcap=[3];
var population=[3];
var country=["Australia"];
var continent=["Oceania"];

svg.selectAll("circle").data(country).enter()
  .append("circle")
  .attr("cx",function(d,i) {return x(GERD[i]);})
  .attr("cy",function(d,i) {return y(growth[i]);})
  .attr("r",10)

  .style("fill","red")
  .style("opacity",0.5)

    .append("title")
    .text(String)
