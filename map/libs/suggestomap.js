

var OpenStreetMapLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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

var SuggestoMapLayers = [
	OpenStreetMapLayer
	/*Esri_WorldImagery,
	Thunderforest_OpenCycleMap,
	Thunderforest_Atlas*/
]

function SuggestoMap(mapid) {
	this.sm = { 
		lmap: null,
		tileLayer: null,
		mlist: [],
		createMap: function (jsonData) {
			this.lmap = L.map(mapid).setView(jsonData.mapcenter, jsonData.zoom);
			
			if (jsonData.tilelayer == 'Esri_WorldImagery') {
				this.tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
				});
			} else {
				this.tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 19,
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				});
			}

			

			this.tileLayer.addTo(this.lmap);

			
	
			for (var i = 0; i < jsonData.markers.length; i++) {
				var jsonMarker = jsonData.markers[i];
				const svgIcon = L.divIcon(getSuggestoIconOptions(jsonMarker.type, jsonMarker.value, jsonMarker.size));
				const aMarker = L.marker(jsonMarker.latlng, { icon: svgIcon }).addTo(this.lmap).bindPopup(jsonMarker.html, { maxWidth: "auto" });
				this.mlist.push(aMarker);
			}
	
			for (var i = 0; i < jsonData.layers.length; i++) {
				var jsonLayer = jsonData.layers[i];
				if (jsonLayer.value !== '') {
					if (jsonLayer.type == 'gpxurl') {
						omnivore.gpx(jsonLayer.value).addTo(this.lmap);
					} else if (jsonLayer.type == 'gpx') {
						omnivore.gpx.parse(jsonLayer.value).addTo(this.lmap);
					} else if (jsonLayer.type == 'kmlurl') {
						omnivore.kml(jsonLayer.value).addTo(this.lmap);
					} else if (jsonLayer.type == 'kml') {
						omnivore.kml.parse(jsonLayer.value).addTo(this.lmap);
					} else if (jsonLayer.type == 'geojsonurl') {
						omnivore.geojson(jsonLayer.value).addTo(this.lmap);
					} else if (jsonLayer.type == 'geojson') {
						//omnivore.geojson.parse(jsonLayer.value).addTo(this.lmap);
					}
				}
			}
	
			/*var baseLayers = {
				"Open Street Map": SuggestoMapLayers[0],
				"Esri WorldImagery": SuggestoMapLayers[1],
				"Thunderforest OpenCycleMap (a pagamento)": SuggestoMapLayers[2],
				"Thunderforest Atlas (a pagamento)": SuggestoMapLayers[3],
			};
		
			L.control.layers(baseLayers).addTo(this.lmap);
	*/
	
			this.lmap.fitBounds(this.getMarkersLatLngArray());
	
		},
		getMarkersLatLngArray() {
			var ar = [];
			var that = this;
			for (var i = 0; i < that.mlist.length; i++) {
				ar.push(that.mlist[i]._latlng);
			}
			return ar;
		}
	}
}














