mapboxgl.accessToken = 'pk.eyJ1IjoiZnJvbnRpZXJzcGF0aWFsIiwiYSI6InRtR1IxUVUifQ.puOgx3mlZrcsVdN2mpPU2A';
const center = [-73.650, 43.57];
const map = new mapboxgl.Map({
    container: 'map',
    zoom: 9.5,
    center: center,
    pitch: 35,
    style: 'mapbox://styles/frontierspatial/ck6kv65z70br21ijjutq4n38w'
});
 
new mapboxgl.Marker().setLngLat(center).addTo(map);
 
function toggleSidebar(id) {
    const elem = document.getElementById(id);
    // Add or remove the 'collapsed' CSS class from the sidebar element.
    // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
    const collapsed = elem.classList.toggle('collapsed');
    const padding = {};
    // 'id' is 'right' or 'left'. When run at start, this object looks like: '{left: 300}';
    padding[id] = collapsed ? 0 : 300; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
    // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
        
    map.easeTo({
        padding: padding,
        duration: 1000 // In ms. This matches the CSS transition duration property.
    });
}

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl({
        visualizePitch: true,
        showCompass: true
    })
);
$( preserves ).each(function( index, data ) {
    console.log( index ,data);
    $("#sidebar-content").append("<div class='preserve-item' id='" + data.name + "'><strong>" + data.name + "</strong><br><img src='./img/" + data.abbr + ".jpg'></div><br>");
  });
    
// Add geolocate control to the map.
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        // When active the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true
    })
);

map.on('load', () => {
    map.addSource('points', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: 'data/points.json'
    });
         
    map.addLayer({
        'id': 'points-layer',
        'type': 'symbol',
        'source': 'points',
        'layout': {
            'icon-image': '{icon}',
            'icon-allow-overlap': true,
            'icon-size': 1
            }
    });
    
    map.addSource('preserves', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: 'data/preserves.json'
    });
         
    map.addLayer({
        'id': 'preserves-layer',
        'type': 'line',
        'source': 'preserves',
        'paint': {
            'line-color': 'Blue',
            'line-width': 2,
            'line-opacity': 0.5
        }
    });
    map.addSource('trails', {
        type: 'geojson',
        // Use a URL for the value for the `data` property.
        data: 'data/trails.json'
    });
         
    map.addLayer({
        'id': 'trails-layer',
        'type': 'line',
        'source': 'trails',
        'paint': {
            'line-color': ['get', 'marker'],
            'line-width': 4,
            'line-opacity': 0.4
        }
    });
    
    toggleSidebar('left');
    map.on('sourcedata', function (e) {
        if (e.sourceId !== 'preserves' || !e.isSourceLoaded) return
        var f = map.querySourceFeatures('preserves')
        if (f.length === 0) return
        var bbox = turf.bbox({
          type: 'FeatureCollection',
          features: f
        });
        map.fitBounds(bbox, {padding: 20});    
      })
});