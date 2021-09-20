var d40_map = {
    data: {
        regionLat: "41.684672",
        regionLng: "14.595614",
        mapActive: false,
        map: {},
    },
    methods: {
        buildMap() {
            if (!this.mapActive) {
                var that = this;
                this.mapActive = true;

                setTimeout(() => {
                    var layers = [],
                        markers = [],
                        map = new SuggestoMap(that.namespace + "_suggesto-map");

                    that.docs.forEach((doc) => {
                        if (doc.contentJSON.geoRef) {
                            var marker = {
                                group: "1",
                                latlng: [parseFloat(doc.contentJSON.geoRef.latitude), parseFloat(doc.contentJSON.geoRef.longitude)],
                                value: "",
                                type: "svgNumIcon",
                                size: "10",
                                color: "#a71d34",
                                html: "",
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

                    if (that.filterConfig.debugMode) {
                        console.log("mapData is: ", mapData);
                    }

                    map.sm.createMap(mapData);

                    that.map = map;
                }, 250);
            }
        },
    },
};
