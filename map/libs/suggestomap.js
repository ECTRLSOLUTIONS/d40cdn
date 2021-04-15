
function SuggestoMap(mapid) {
	this.sm = {
		version: '1.2',
		lmap: null,
		tileLayer: null,
		mlist: [],
		llist: [],
		tlayers: {
			'osm': {
				layer: null,
				name: 'Open Street map' 
			},
			'satellite': {
				layer: null,
				name: 'Satellite' 
			},
			'mapbox': {
				layer: null,
				name: 'Outdoor' 
			},
			'mapboxsatellite': {
				layer: null,
				name: 'Satellite' 
			},
			'googleterrain': {
				layer: null,
				name: 'Terrain' 
			}
		},
		defaults: {
			gestureHandling: true,
			layersFilter: '*',
			markersFilter: '*',
			tilelayer: 'osm',
			tilelayers: ['osm', 'satellite', 'mapbox']
		},
		createMap: function (jsonData) {
			var vm = this;
			for (var attrname in vm.defaults) {
				if (typeof (jsonData[attrname]) !== 'undefined') {
					vm.defaults[attrname] = jsonData[attrname];
					vm.defaults[attrname] = jsonData[attrname];
				};
			}

			if (vm.lmap == null) {

				vm.lmap = L.map(mapid, { gestureHandling: vm.defaults.gestureHandling }).setView(jsonData.mapcenter, jsonData.zoom);

				vm.tlayers['osm'].layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
					maxZoom: 19,
					attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				});


				vm.tlayers['satellite'].layer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
					attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
				});

				vm.tlayers['mapbox'].layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
					attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
					maxZoom: 22,
					id: 'mapbox/outdoors-v11',
					tileSize: 512,
					zoomOffset: -1,
					accessToken: 'pk.eyJ1IjoiZGFyaW9jYXZhZGEiLCJhIjoiY2s4OXlrMWx3MGJmazNscW16Mm5xOGM5NCJ9.zQ-hBwzOvuVCGH0x7mHJdg'
				})

				vm.tlayers['mapboxsatellite'].layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
					attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
					maxZoom: 22,
					id: 'mapbox/satellite-streets-v11',
					tileSize: 512,
					zoomOffset: -1,
					accessToken: 'pk.eyJ1IjoiZGFyaW9jYXZhZGEiLCJhIjoiY2s4OXlrMWx3MGJmazNscW16Mm5xOGM5NCJ9.zQ-hBwzOvuVCGH0x7mHJdg'
				})

				vm.tlayers['googleterrain'].layer = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
					maxZoom: 20,
					subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
				});


				var baseLayers = {};
				var baseLayersCount = 0;
				
				for (var itl=0;itl < vm.defaults.tilelayers.length;itl++) {
					var layerId = vm.defaults.tilelayers[itl];
					if (typeof(vm.tlayers[layerId]) !== 'undefined') {
						baseLayers[vm.tlayers[layerId].name] = vm.tlayers[layerId].layer
						baseLayersCount++;
					}
				}

				if (baseLayersCount > 1) {
					L.control.layers(baseLayers).addTo(vm.lmap);
				}
				
				var defaultTileLayer = vm.tlayers[vm.defaults.tilelayer];
				if (typeof(defaultTileLayer) !== 'undefined') {
					defaultTileLayer.layer.addTo(vm.lmap)
				} else {
					defaultTileLayer = vm.tlayers['osm']
				}
				defaultTileLayer.layer.addTo(vm.lmap);
			}

			// Markers ---

			if (vm.mlist.length > 0) {
				for (var i = 0; i < vm.mlist.length; i++) {
					vm.mlist[i].marker.removeFrom(vm.lmap);
					vm.mlist[i].marker = null;
				}
				vm.mlist = [];
			}

			for (var i = 0; i < jsonData.markers.length; i++) {
				var jsonMarker = jsonData.markers[i];
				console.log(jsonMarker)
				const svgIcon = L.divIcon(getSuggestoIconOptions(jsonMarker.type, jsonMarker.value, jsonMarker.size, jsonMarker['color']));
				const aMarker = L.marker(jsonMarker.latlng, { icon: svgIcon });
				if (jsonMarker.html !== '') {
					aMarker.bindPopup(jsonMarker.html, { maxWidth: "auto" });
				}
				aMarker['customdata'] = jsonMarker;
				aMarker.on('click', function (e) {
					if (e.sourceTarget.customdata.group.split.length < 3) {
						var filter = e.sourceTarget.customdata.group + '.*';
						vm.showFilteredMarkers(filter);
						vm.showFilteredLayers(filter);
						
					}
				});
				//aMarker.on('mouseover', function (e) { console.log('mouseover', e.sourceTarget.customdata) });
				vm.mlist.push({ json: jsonMarker, marker: aMarker });
			}

			vm.showFilteredMarkers(vm.defaults.markersFilter);

			// Other layers -- paths

			if (vm.llist.length > 0) {
				for (var i = 0; i < vm.llist.length; i++) {
					vm.llist[i].layer.removeFrom(vm.lmap);
					vm.llist[i].layer = null;
				}
				vm.llist = [];
			}


			for (var i = 0; i < jsonData.layers.length; i++) {
				var jsonLayer = jsonData.layers[i];
				var aLayer = null;
				if (jsonLayer.value !== '') {
					if (jsonLayer.type == 'gpxurl') {
						aLayer = omnivore.gpx(jsonLayer.value);
					} else if (jsonLayer.type == 'gpx') {
						aLayer = omnivore.gpx.parse(jsonLayer.value);
					} else if (jsonLayer.type == 'kmlurl') {
						aLayer = omnivore.kml(jsonLayer.value);
					} else if (jsonLayer.type == 'kml') {
						aLayer = omnivore.kml.parse(jsonLayer.value);
					} else if (jsonLayer.type == 'geojsonurl') {
						aLayer = omnivore.geojson(jsonLayer.value);
					} else if (jsonLayer.type == 'geojson') {
						//omnivore.geojson.parse(jsonLayer.value).addTo(this.lmap);
					}
				}

				if (aLayer !== null) {
					vm.llist.push({ json: jsonLayer, layer: aLayer });
				}
			}

			vm.showFilteredLayers(vm.defaults.layersFilter);

			vm.lmap.on('click', function(){
				//alert("You clicked the map at " + e.latlng);
				vm.showFilteredMarkers('*');
				vm.showFilteredLayers('*');
			});

			vm.lmap.fitBounds(vm.getMarkersLatLngArray());

		},
		getMarkersLatLngArray() {
			var ar = [];
			var vm = this;
			for (var i = 0; i < vm.mlist.length; i++) {
				ar.push(vm.mlist[i].marker._latlng);
			}
			return ar;
		},
		hideAll(group) {
			var vm = this;
			for (var i = 0; i < vm.mlist.length; i++) {
				vm.mlist[i].marker.removeFrom(vm.lmap)
			}
		},
		hideGroup(group) {
			var vm = this;
			for (var i = 0; i < vm.mlist.length; i++) {
				var jsm = vm.mlist[i].json;
				if (jsm.group == group) {
					vm.mlist[i].marker.removeFrom(vm.lmap)
				}
			}
		},
		showAll(group) {
			var vm = this;
			for (var i = 0; i < vm.mlist.length; i++) {
				vm.mlist[i].marker.addTo(vm.lmap)
			}
		},
		showGroup(group) {
			var vm = this;
			for (var i = 0; i < vm.mlist.length; i++) {
				var jsm = vm.mlist[i].json;
				if (jsm.group == group) {
					vm.mlist[i].marker.addTo(vm.lmap)
				}
			}
		},
		showFilteredMarkers(filter) {
			var vm = this;
			for (var i = 0; i < vm.mlist.length; i++) {
				var jsm = vm.mlist[i].json;
				var show = false;
				const fa = filter.split('.');
				const fg = jsm.group.split('.');

				if (fg.length <= fa.length) {

					var match = 0;
					for (var y = 0; y < fa.length; y++) {
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
					vm.mlist[i].marker.addTo(vm.lmap)
				} else {
					vm.mlist[i].marker.removeFrom(vm.lmap)
				}
			}
		},
		showFilteredLayers(filter) {
			var vm = this;
			for (var i = 0; i < vm.llist.length; i++) {
				var jsm = vm.llist[i].json;
				var show = false;
				const fa = filter.split('.');
				const fg = jsm.group.split('.');

				if (fg.length <= fa.length) {

					var match = 0;
					for (var y = 0; y < fa.length; y++) {
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
					vm.llist[i].layer.addTo(vm.lmap)
				} else {
					vm.llist[i].layer.removeFrom(vm.lmap)
				}
			}
		}
	}
}














