
/*Setting the map */
var myMap = L.map('mapid', {
    center: [0,0],
    zoom: 4

});


/* MAPBOX BASE LAYER IN BLACK STYLE AS BACKGROUND */
var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: '© <a href="https://www.mapbox.com/feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
}).addTo(myMap);


/* Calling to geojson from latest month over 4.5 magnitude*/
var URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

/* collecting dataset using d3.json function and  */
d3.json(URL).then(function(data) {
    
    // extract only the features (each earthquake) from geojson
    let earthquakes = data.features;
   
    /*Sets up our color scheme for earthquakes depending on their magnitude*/
    let color = {
        level1: "#3c0",
        level2: "#9f6",
        level3: "#fc3",
        level4: "#f93",
        level5: "#c60",
        level6: "#c00"
    };

    /* For each of the earthquakes, we are now identifying the lat/long and assessing a severity color to the earthquake */

    for (var i = 0; i < earthquakes.length; i++) {
        let latitude = earthquakes[i].geometry.coordinates[1];
        let longitude = earthquakes[i].geometry.coordinates[0];
        let magnitude = earthquakes[i].properties.mag;
        var fillColor;
        if (magnitude > 7) {
            fillColor = color.level6;
        } else if (magnitude > 6.5) {
            fillColor = color.level5;
        } else if (magnitude > 6) {
            fillColor = color.level4;
        } else if (magnitude > 5.5) {
            fillColor = color.level3;
        } else if (magnitude > 5) {
            fillColor = color.level2;
        } else {
            fillColor = color.level1;
        };
        console.log(latitude);

        /* Circle marker for each earthquake defined by magnitude with exponential 2 */
        var epicenter = L.circleMarker([latitude, longitude], {
            radius: magnitude ** 2,
            color: "black",
            fillColor: fillColor,
            fillOpacity: 1,
            weight: 1
        });
        epicenter.addTo(myMap);


        /* Labels as a pop-up */

        epicenter.bindPopup("<h3> " + new Date(earthquakes[i].properties.time) + "</h3><h4>Magnitude: " + magnitude +
            "<br>Location: " + earthquakes[i].properties.place + "</h4><br>");

    }

    /* Legend ing Bottom Right */
    var legend = L.control({
        position: 'bottomright'
    });

    /* Adding on the legend based off the color scheme we have */
    legend.onAdd = function (color) {
        var div = L.DomUtil.create('div', 'info legend');
        var levels = ['>1', '1-2', '2-3', '3-4', '4-5', '5+'];
        var colors = ['#3c0', '#9f6', '#fc3', '#f93', '#c60', '#c00']
        for (var i = 0; i < levels.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i>' + levels[i] + '<br>';
        }
        return div;
    }
    legend.addTo(myMap);

});