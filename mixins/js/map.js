var d40_map = {
    data: {
        regionLat: "41.684672",
        regionLng: "14.595614",
        map: {},
    },
    mounted() {
        this.buildMap();
    },
    methods: {
        buildMap: function () {
            var that = this,
                layers = [],
                markers = [],
                map = new SuggestoMap(this.namespace + "_suggesto-map");

            this.docs.forEach(function (doc) {
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

            console.log("mapData is: ", mapData);

            map.sm.createMap(mapData);

            this.map = map;
        },
    },
};
