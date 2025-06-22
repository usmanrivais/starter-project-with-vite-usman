import L from 'leaflet';
import CONFIG from '../config';

const LocationHelper = {
    _map: null,
    _marker: null,

    init() {
        this._map = L.map('location-map').setView([-2.5489, 118.0149], 5);
        L.tileLayer(CONFIG.MAP_TILE_URL, {
            maxZoom: 19,
            attribution: '© OpenStreetMap contributors',
            apiKey: CONFIG.MAP_API_KEY,
        }).addTo(this._map);

        this._map.on('click', (e) => this._onMapClick(e));
    },

    _onMapClick(e) {
        const { lat, lng } = e.latlng;
        document.querySelector('#latitude').value = lat;
        document.querySelector('#longitude').value = lng;

        if (this._marker) {
            this._marker.setLatLng(e.latlng);
        } else {
            this._marker = L.marker(e.latlng).addTo(this._map);
        }

        alert(`Lokasi dipilih: Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}`);
    },
};

export default LocationHelper;