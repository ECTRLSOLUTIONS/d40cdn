
function SuggestoMap(mapid) {
	this.sm = { 
		lmap: null,
		tileLayer: null,
		mlist: [],
		createMap: function (jsonData) {
			var that = this;
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
				const aMarker = L.marker(jsonMarker.latlng, { icon: svgIcon })
				aMarker.bindPopup(jsonMarker.html, { maxWidth: "auto" });
				aMarker['customdata'] = jsonMarker;
				aMarker.on('click', function(e){
					var filter = e.sourceTarget.customdata.group+'.*';
					console.log("filter>>>>>",filter);
					that.showFilteredMarkers(filter);
				});
				aMarker.on('mouseover', function(e){console.log('mouseover',e.sourceTarget.customdata)});
				this.mlist.push({json: jsonMarker, marker: aMarker});
			}

			that.showFilteredMarkers(jsonData.markersFilter);
	
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

			
			
			this.lmap.on('click', that.onMapClick);
	
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
		onMapClick(e) {
			//alert("You clicked the map at " + e.latlng);
			showFilteredMarkers('*');
		},
		getMarkersLatLngArray() {
			var ar = [];
			var that = this;
			for (var i = 0; i < that.mlist.length; i++) {
				ar.push(that.mlist[i].marker._latlng);
			}
			return ar;
		},
		hideGroup(group) {
			var that = this;
			for (var i = 0; i < that.mlist.length; i++) {
				var jsm = that.mlist[i].json;
				if (jsm.group == group) {
					that.mlist[i].marker.removeFrom(that.lmap)
				}
			}
		},
		showGroup(group) {
			var that = this;
			for (var i = 0; i < that.mlist.length; i++) {
				var jsm = that.mlist[i].json;
				if (jsm.group == group) {
					that.mlist[i].marker.addTo(that.lmap)
				}
			}
		},
		showFilteredMarkers(filter) {
			var that = this;
			for (var i = 0; i < that.mlist.length; i++) {
				var jsm = that.mlist[i].json;
				var show = false;
				const fa = filter.split('.');
				const fg = jsm.group.split('.');

				if (fg.length <= fa.length) {
					
					var match = 0;
					for (var y=0;y<fa.length;y++) {
						if (fa[y] == '*') {
							match++;
						} else {
							if (fa[y] == fg[y]) {
								match++;
							}
						}
					}

					if (fa.length == match) {
						show = true;
					}

				}

				/* Caso particolare */ 
				if (fg.length == 2) {
					if (fg[0] == fa[0]) {
						if (fg[0] == fa[0]) {
							show = true;
						}
					}
				}

				if (fg.length == 1) {
					show = true;
				}

				if (show) {
					that.mlist[i].marker.addTo(that.lmap)
				} else {
					that.mlist[i].marker.removeFrom(that.lmap)
				}
			}
		}
	}
}














