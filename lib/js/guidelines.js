
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
		 "Positive":"btn-success","Neutral":"","Negative":"btn-danger"};
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
	var items=["Low","Medium","High","Positive","Negative"];
	for(var i = 0; i < sectors.length; i++){
		var Lows = Mediums = Highs = Positives = Neutrals = Negatives = 0;
		for(var block in vals){
			console.log('#'+block+'-'+sectors[i],$('#'+block+'-'+sectors[i]).val());
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
			console.log("#"+blocks[j]+"-"+sectors[i]+"-low",Lows+Positives);
			$("#"+blocks[j]+"-"+sectors[i]+"-low").text(Lows+Positives);
	    	$("#"+blocks[j]+"-"+sectors[i]+"-medium").text(Mediums);
	    	$("#"+blocks[j]+"-"+sectors[i]+"-high").text(Highs+Negatives);
			if (Lows+Positives < Highs+Negatives){
				overall="High";
			}else{
				overall="Low";
			}
			$("#"+blocks[j]+"-"+sectors[i]+"-overall").text(overall);
		}//for blocks badges
	}//for sectors
	
}


//D3 matrix graph
