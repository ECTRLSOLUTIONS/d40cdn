var d40_map = {
    data: {
        regionLat: "",
        regionLng: "",
        map: {},
    },
    methods: {
        buildMap(id, docs = this.docs, pinColor = "#000000", regionCoords = { lat: "0", lng: "0" }, pinHtml = "") {
            if (!document.getElementById(id).hasChildNodes()) {
                var that = this;

                this.regionLat = regionCoords.lat;
                this.regionLng = regionCoords.lng;

                setTimeout(() => {
                    var layers = [],
                        markers = [],
                        map = new SuggestoMap(that.namespace + "_suggesto-map");

                    docs.forEach((doc) => {
                        if (doc.contentJSON.geoRef) {
                            var marker = {
                                group: "1",
                                latlng: [parseFloat(doc.contentJSON.geoRef.latitude), parseFloat(doc.contentJSON.geoRef.longitude)],
                                value: "",
                                type: "svgNumIcon",
                                size: "10",
                                color: pinColor,
                                html: pinHtml,
                            };

                            markers.push(marker);
                        }
                    });

                    var mapData = {
                        tilelayer: "osm",
                        gestureHandling: true,
                        fitBounds: false,
                        mapcenter: [parseFloat(that.regionLat), parseFloat(that.regionLng)],
                        zoom: 10,
                        markersFilter: "*",
                        markers: markers,
                        layers: layers,
                    };

                    if (that.filterConfig?.debugMode || that.debugMode) {
                        console.log("mapData is: ", mapData);
                    }

                    map.sm.createMap(mapData);

                    that.map = map;
                }, 250);
            }
        },
    },
};
