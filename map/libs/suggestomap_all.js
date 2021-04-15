

/*

OpenCycleMap
https://tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey=7a0d9c39c5194c0086573c444decddae
Transport
https://tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=7a0d9c39c5194c0086573c444decddae
Landscape
https://tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=7a0d9c39c5194c0086573c444decddae
Outdoors
https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=7a0d9c39c5194c0086573c444decddae
Transport Dark
https://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey=7a0d9c39c5194c0086573c444decddae
Spinal Map
https://tile.thunderforest.com/spinal-map/{z}/{x}/{y}.png?apikey=7a0d9c39c5194c0086573c444decddae
Pioneer
https://tile.thunderforest.com/pioneer/{z}/{x}/{y}.png?apikey=7a0d9c39c5194c0086573c444decddae
Mobile Atlas
https://tile.thunderforest.com/mobile-atlas/{z}/{x}/{y}.png?apikey=7a0d9c39c5194c0086573c444decddae
Neighbourhood
https://tile.thunderforest.com/neighbourhood/{z}/{x}/{y}.png?apikey=7a0d9c39c5194c0086573c444decddae
Atlas
https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=7a0d9c39c5194c0086573c444decddae
*/


var htmlIconLetter = "";
var markerOptionsLetter = {};

function addSvgIconToMap(url, value) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			// Typical action to be performed when the document is ready:
			console.log(xhttp.responseText);
			htmlIconLetter = xhttp.responseText;
			const size = 50;
			const iconOptionsLetter = {
				iconSize: [size, size],
				iconAnchor: [size / 2, size - 7],
				className: 'mymarker',
				html: htmlIconLetter.replace('$A',value)
			}

			markerOptionsLetter = {
				draggable: false,
				icon: L.divIcon(iconOptionsLetter)
			}

			const myMarker3 = L.marker([45.5705491, 8.0198211], markerOptionsLetter).addTo(mymap);
			myMarker3.bindPopup("<b>Hello world!</b><br />I am a popup SVG.");

		}
	};
	xhttp.open("GET", url, true);
	xhttp.send();
}

//loadSvgIcon('icons/iconletter.svg', 'A');
loadSvgIcon('icons/iconnumber.svg', '1');


const myMarker3 = L.marker([45.5705491, 8.0198211], {icon: L.divIcon(getSuggestoIconOptions('svgTxtIcon', '2', 50))}).addTo(mymap).bindPopup("<b>Hello world!</b><br />I am a popup SVG.");

var mymap = L.map('mapid').setView([45.5668237, 8.0661697], 13);

var OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var Esri_WorldStreetMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
});

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

// Pagamento
var Thunderforest_OpenCycleMap = L.tileLayer('https://{s}.tile.thunderforest.com/cycle/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '7a0d9c39c5194c0086573c444decddae',
	maxZoom: 22
});

var Thunderforest_Atlas = L.tileLayer('https://tile.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: '7a0d9c39c5194c0086573c444decddae',
	maxZoom: 22
});


//Thunderforest_Atlas.addTo(mymap);
Thunderforest_OpenCycleMap.addTo(mymap);

/*L.marker([45.5705491, 8.0198211]).addTo(mymap)
	.bindPopup("<b>Hello world!</b><br />I am a popup.");*/
/*

var firefoxIcon = L.icon({
	iconUrl: 'icons/iconletter.svg',
	iconSize: [80, 80], // size of the icon
});

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

mymap.on('click', onMapClick);

const size = 50;
const iconOptions = {
	iconSize: [size, size],
	iconAnchor: [size / 2, size - 7],
	className: 'mymarker',
	html: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M 10.53125 4.875 L 10.15625 5.46875 C 10.15625 5.46875 8.894531 7.410156 7.28125 9.625 C 5.667969 11.839844 3.632813 14.347656 2.4375 15.1875 L 1.9375 15.53125 L 2 16.125 L 3 25.125 L 3.09375 26 L 4 26 C 5.484375 26 7.214844 26.078125 8.9375 26.1875 L 10 26.25 L 10 18 L 12 18 L 12 26.40625 L 12.90625 26.5 C 15.734375 26.75 17.875 27 17.875 27 L 18.03125 27 L 28.96875 24.8125 L 29 24.03125 C 29 24.03125 29.089844 22.363281 29.25 20.40625 C 29.410156 18.449219 29.671875 16.148438 29.9375 15.3125 L 30.15625 14.625 L 29.625 14.21875 C 26.175781 11.546875 22.875 5.53125 22.875 5.53125 L 22.5625 4.90625 L 21.84375 5 C 21.84375 5 15.417969 5.886719 11.1875 5.03125 Z M 21.46875 7.0625 C 21.878906 7.824219 23.902344 11.441406 26.8125 14.3125 L 19.28125 15.5 C 16.816406 13.132813 14.304688 9.390625 12.9375 7.21875 C 16.808594 7.617188 20.628906 7.175781 21.46875 7.0625 Z M 10.9375 7.875 C 12.25 9.988281 15.003906 14.136719 17.90625 16.90625 C 17.25 19.582031 17.050781 23.148438 17 24.90625 C 16.332031 24.835938 15.527344 24.738281 14 24.59375 L 14 16 L 8 16 L 8 24.15625 C 6.933594 24.097656 5.898438 24.046875 4.90625 24.03125 L 4.0625 16.34375 C 5.675781 15.03125 7.402344 12.875 8.90625 10.8125 C 9.882813 9.46875 10.492188 8.550781 10.9375 7.875 Z M 27.78125 16.21875 C 27.546875 17.410156 27.367188 18.816406 27.25 20.21875 C 27.121094 21.800781 27.089844 22.667969 27.0625 23.1875 L 19.03125 24.8125 C 19.082031 23.050781 19.265625 19.71875 19.78125 17.46875 Z"/></svg>'
}

const markerOptions = {
	draggable: true,
	icon: L.divIcon(iconOptions)
}
const myMarker = L.marker([45.5705491, 8.0198211], markerOptions).addTo(mymap)

const markerOptions2 = {
	draggable: true,
	icon: firefoxIcon
}
const myMarker2 = L.marker([45.5705491, 8.0198211], markerOptions2).addTo(mymap)

var popup = L.popup();

*/

