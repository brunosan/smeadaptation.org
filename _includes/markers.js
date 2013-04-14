// Create an empty markers layer
var markerLayer = mapbox.markers.layer();

// Add interaction to this marker layer. This
// binds tooltips to each marker that has title
// and description defined.
map.addLayer(markerLayer);

var alert = document.getElementById('markerinfo');

markerLayer.factory(function(f) {
    var elem = mapbox.markers.simplestyle_factory(f);
    MM.addEvent(elem, 'click', function(e) {
        // clear the alert box
        alert.innerHTML = '';
        // add a header and paragraph, and fill them with content
        // from the feature, which we've stored as the variable 'f'
        var h1 = alert.appendChild(document.createElement('h1'));
        var p = alert.appendChild(document.createElement('p'));
        // pull the title and description attributes of the feature.
        // you could customize this to pull other attributes
        h1.innerHTML = f.properties.title;
        p.innerHTML = f.properties.description;
        // prevent this event from bubbling down to the map and clearing
        // the content
        e.stopPropagation();
    });
    return elem;
});

// clear the content of alert when the user clicks on a map area other
// than a tooltip
MM.addEvent(map.parent, 'click', function() {
    var alert = document.getElementById('markerinfo');
    alert.innerHTML = '';
});

// See the 'adding a single marker example for help with adding a marker
markerLayer.add_feature({
    geometry: {
        coordinates: [-93.06, 20.863]
    },
    properties: {
        'marker-color': '#000',
        'marker-symbol': 'star-stroked',
        title: 'Example Marker',
        description: 'This is a single marker.'
    }
});