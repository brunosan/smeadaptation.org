// Create an empty markers layer
var markerLayer = mapbox.markers.layer();

// Add interaction to this marker layer. This
// binds tooltips to each marker that has title
// and description defined.
map.addLayer(markerLayer);
mapbox.markers.interaction(markerLayer);



markerLayer.factory(function(f) {
	
	var elem = mapbox.markers.simplestyle_factory(f);
	
    MM.addEvent(elem, 'click', function(e) {
	    var info = document.getElementById('markerinfo');
		var pic = document.getElementById('markerpic');
		
        // clear the alert box
        info.innerHTML = '';
		pic.innerHTML = '';
        // add a header and paragraph, and fill them with content
        // from the feature, which we've stored as the variable 'f'
        var h2 = info.appendChild(document.createElement('h2'));
        var p = info.appendChild(document.createElement('p'));
		var a=  info.appendChild(document.createElement('a'));
		var img= pic.appendChild(document.createElement("img"));
		
        // pull the title and description attributes of the feature.
        // you could customize this to pull other attributes
        h2.innerHTML = f.properties.title;
        p.innerHTML = f.properties.intro;
		a.className="btn"; 
		a.href= f.properties.url;
		a.innerHTML='View complete post &raquo';
		img.src= f.properties.image;
        // prevent this event from bubbling down to the map and clearing
        // the content
        e.stopPropagation();
    });
    return elem;
});

// clear the content of alert when the user clicks on a map area other
// than a tooltip
MM.addEvent(map.parent, 'click', function() {
    var info = document.getElementById('markerinfo');
	var pic = document.getElementById('markerpic');
	
    info.innerHTML = '';
	pic.innerHTML = '';
});

// See the 'adding a single marker example for help with adding a marker
{% for post in site.posts %}{% if post.lang == 'en' %}{% if post.location  %}
   markerLayer.add_feature({ 	
		geometry: {
	        coordinates: [{{ post.location }}]
		},
	    properties: {
	        'marker-color': '{{ post.color }}',
	        'marker-symbol': '{{ post.icon }}',
	        title: '{{ post.title }}',
	        intro: '{{ post.content | split:'</p>' | first | truncatewords: 50 | strip_newlines | strip_html }}',
			image: '{{site.baseurl}}img/{{post.image}}',
			url: '{{post.url}}'
	    }
	});
{% endif %}{% endif %}{% endfor %}
	