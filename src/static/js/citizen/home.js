// Access the map
mapboxgl.accessToken = "pk.eyJ1IjoidHRiaW50dCIsImEiOiJjbHBnb282amQwMDVjMmpyeHY5N2c1bXMyIn0.ti-gYOhpihy4YzAFbKuxZQ";

// Initialize the map
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [106.68223, 10.762649],
    zoom: 18,
    projection: "globe"
});

// Global variable
let currentMarker = null;

// User Location
navigator.geolocation.getCurrentPosition(position => {
    const userLocation = [position.coords.longitude, position.coords.latitude];
    map.setCenter(userLocation);
    if (currentMarker) {
        currentMarker.remove();
    }
    currentMarker = new mapboxgl.Marker().setLngLat(userLocation).addTo(map);
});

// Fullscreen Controll
map.addControl(new mapboxgl.FullscreenControl());

// Compass Controll
map.addControl(new mapboxgl.NavigationControl());

// Auto Geocoding Search
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    placeholder: "Tìm kiếm theo địa chỉ",
    zoom: 15,
    marker: false
});
map.addControl(geocoder, "top-left");

// Listen for the 'result' event when a location is selected
geocoder.on("result", function (event) {
    var coordinates = event.result.geometry.coordinates;
    if (currentMarker) {
        currentMarker.remove();
    }
    currentMarker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
});

// Listen click the point in the map
map.on("click", function (e) {
    let coordinates = e.lngLat;
    if (currentMarker) {
        currentMarker.remove();
    }
    currentMarker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
});

// Listen on the Switch
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("switchAds").addEventListener("change", function () {});
    document.getElementById("switchReport").addEventListener("change", function () {});
});
