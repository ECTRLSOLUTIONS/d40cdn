var app = new Vue({
    el: '#app',
    data: {
        smap: null,
        marker: null,
        markerLatLon:  [ 41.80816874501552, 14.864503554687492 ],
        label: 'LABEL',
        labelLatLon: [ 41.78737626961763, 14.753750190138819 ],
        icon: null,
        markerLabel: null,
        //imageUrl: 'https://s3-eu-west-1.amazonaws.com/mkspresstage.suggesto.eu/dario/map/data/moliseimage.png',
        //imageUrl: 'https://s3-eu-west-1.amazonaws.com/mkspresstage.suggesto.eu/dario/map/data/cuneo.png',
        imageUrl: '../data/moliseimage.png',
        imageBounds:  [ [ 41.894549286985864, 13.94616756588221 ], [ 41.48434364839451, 14.608093835413458 ] ],
        imgOverlay: null,
        destImageOverlay: null,
        imageCorners: null,
        jsonMapData : {
            tilelayer: 'satellite',
            tilelayers: ['osm', 'satellite', 'mapbox'],
            mapcenter: [41.6914, 14.6860],
            zoom: 9,
            zoomControl: true, // Nuovo parametro per disabilitare i controlli zoom.
            attributionControl: true, // Nuovo parametro per togliere la label Leaflet 
            markersFilter: '*',
            gestureHandling: true,
            fitBounds: false,
            markers: [],
            layers: []
        },

    },
    methods: {
        reverseMessage: function () {
            this.message = this.message.split('').reverse().join('')
        },
        addMarkerAndImage: function() {
            // Marker cerchio
            var vm = this;
            if (vm.marker != null) {
                vm.smap.sm.lmap.removeLayer(vm.marker);
            }
            if (vm.markerLabel != null) {
                vm.smap.sm.lmap.removeLayer(vm.markerLabel);
            }
            if (vm.imgOverlay != null) {
                vm.smap.sm.lmap.removeLayer(vm.imgOverlay);
            }

            this.marker = L.circleMarker(this.markerLatLon, { draggable: true, radius: 3, color: '#000', fillOpacity: 1 }).addTo(this.smap.sm.lmap);
            this.marker.on('dragend', function(event){
                var marker = event.target;
                var position = marker.getLatLng();
                vm.markerLatLon = [position.lat, position.lng];
                console.log(vm.markerLatLon);
                /*marker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'});
                map.panTo(new L.LatLng(position.lat, position.lng))*/
              });
            // Immagine Overlay
            this.icon = L.divIcon({ iconSize: -10, html: this.label });
            this.markerLabel = L.marker(this.labelLatLon, { icon: this.icon, draggable: true }).addTo(this.smap.sm.lmap);
            this.markerLabel.on('dragend', function(event){
                var marker = event.target;
                var position = marker.getLatLng();
                vm.labelLatLon = [position.lat, position.lng];
                console.log(vm.labelLatLon);
                /*marker.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'});
                map.panTo(new L.LatLng(position.lat, position.lng))*/
              });
            // DistortableImageOverlay
            this.imgOverlay = L.distortableImageOverlay(this.imageUrl, {
                selected: true,
                crossOrigin: true,
                corners: this.imageCorners,
                actions: [L.ScaleAction, L.OpacityAction, L.DeleteAction,],
            }).addTo(this.smap.sm.lmap);

            L.DomEvent.on(this.imgOverlay.getElement(), 'mouseup touchend', function () {
                var corners = vm.imgOverlay.getCorners();
                console.log(JSON.stringify(corners));
                vm.imageBounds = [[corners[0].lat, corners[0].lng],[corners[3].lat, corners[3].lng]];
                vm.imageCorners = corners;
                // JUST FOR TEST vm.moveImage();
            });
        },
        moveImage() {
            if (this.destImageOverlay != null) {
                this.destImageOverlay.setBounds(this.imageBounds);
            } else {
                this.destImageOverlay = L.imageOverlay(this.imageUrl, this.imageBounds).addTo(this.smap.sm.lmap).bringToFront();
            }
        
        }
    },
    created: function () {
        
        console.log('created');
    },
    mounted: function () {
        console.log('mounted');
        this.smap = new SuggestoMap('mapid1');
        this.smap.sm.createMap(this.jsonMapData);
       // this.smap.sm.disableMapTouch();

        this.addMarkerAndImage();
    }
})


// Wait until image is loaded before setting up DOM element listeners
/*L.DomEvent.on(imgOverlay.getElement(), 'load', function () {
    L.DomEvent.on(imgOverlay, 'edit', function () {
        // console.log(JSON.stringify(imgOverlay.getCorners()));
    });
    L.DomEvent.on(imgOverlay.getElement(), 'mouseup touchend', function () {
        console.log(JSON.stringify(imgOverlay.getCorners()));
    });
});*/
    /*sm1.sm.lmap.on('click', function (e) {
console.log('click: ', e.latlng);
if (newBounds.length < 2) {
    newBounds.push([e.latlng.lat, e.latlng.lng]);
    console.log(newBounds.length)
    if (newBounds.length == 2) {
        limgoverlay.setBounds(newBounds);
        newBounds = [];
    }
}
});*/