// center of the map
var center = [41.6914,14.6860];

// Create the map
var map = L.map('map').setView(center, 9);

// Set up the OSM layer

  
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
					attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
					maxZoom: 22,
					id: 'mapbox/light-v10',
					tileSize: 512,
					zoomOffset: -1,
					accessToken: 'pk.eyJ1IjoiZGFyaW9jYXZhZGEiLCJhIjoiY2s4OXlrMWx3MGJmazNscW16Mm5xOGM5NCJ9.zQ-hBwzOvuVCGH0x7mHJdg'
				}).addTo(map);

// add a marker in the given location
L.marker(center).addTo(map);
L.marker([41.6914,14.6860]).addTo(map);

map.on('click', function(e) {
    alert(e.latlng);
});

var imageUrl = 'https://s3-eu-west-1.amazonaws.com/mkspresstage.suggesto.eu/dario/map/data/moliseimage.png',
  imageBounds = [[42.15322, 13.91418], [41.33351, 15.16663]];

//L.imageOverlay(imageUrl, imageBounds).addTo(map);
//L.imageOverlay(imageUrl, imageBounds).bringToFront();
