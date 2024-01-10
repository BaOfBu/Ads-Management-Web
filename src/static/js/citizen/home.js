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

// Function default for Switch
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const button = document.getElementById("toggleSidebarButton");
    sidebar.style.width = "600px";
    button.style.display = "block";
    button.addEventListener("click", () => {
        sidebar.style.width = "0px";
        button.style.display = "none";
    });
}
function createPopup() {
    return new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        offset: 25,
        maxWidth: "300px",
        className: "my-custom-popup"
    });
}
// Listen on the Switch Ads
let marker_ads = [];
function mouseEnterAds(el, ad, popup) {
    popup
        .setLngLat([ad.long, ad.lat])
        .setHTML(
            `
<div class="info-popup-content">
    <span class="title-popup-info">${ad.ads_type_name}</span>
    <span>${ad.location_type_name}</span>
    <span>${ad.location}</span>
    <span class="status-popup-info">${ad.status}</span>
</div>
`
        )
        .addTo(map);
}
function createMarkerElementAds(ad) {
    const el = document.createElement("div");
    el.className = "marker";
    el.style.width = "30px";
    el.style.height = "30px";

    if (ad.status === "Đã quy hoạch") {
        el.style.backgroundImage = 'url("/static/images/citizen/ads-blue.png")';
    } else if (ad.status === "Chưa quy hoạch") {
        el.style.backgroundImage = 'url("/static/images/citizen/ads-red.png")';
    }

    el.style.backgroundSize = "cover";
    return el;
}
function createMarkerAds(ad) {
    const el = createMarkerElementAds(ad);
    const marker = new mapboxgl.Marker(el).setLngLat([ad.long, ad.lat]).addTo(map);
    marker_ads.push(marker);
    // Add event listeners for hover
    const popup = createPopup();
    el.addEventListener("mouseenter", () => mouseEnterAds(el, ad, popup));
    el.addEventListener("mouseleave", () => popup.remove());
    el.addEventListener("click", () => toggleSidebar());
}
document.getElementById("switchAds").addEventListener("change", function () {
    if (this.checked) {
        $.getJSON(`http://localhost:8888/department-officer/get-ads-location`, function (data) {
            if (data === false) {
                alert("Không thể tải dữ liệu từ Server");
            } else {
                data.forEach(ad => {
                    createMarkerAds(ad);
                });
            }
        });
    } else {
        marker_ads.forEach(function (marker) {
            marker.remove();
        });
        marker_ads = [];
    }
});

// Listen on the Switch Report
let marker_report = [];
function mouseEnterReport(el, report, popup) {
    popup
        .setLngLat([report.long, report.lat])
        .setHTML(
            `
                <div class="info-popup-content">
                    <span class="title-popup-info">${report.reportType}</span>
                    <p>${report.content}<p>
                </div>
                `
        )
        .addTo(map);
}
function createMarkerElementReport(report) {
    const el = document.createElement("div");
    el.className = "marker";
    el.style.width = "30px";
    el.style.height = "30px";
    if (report.status === "Đã xử lý") {
        el.style.backgroundImage = 'url("/static/images/citizen/report-blue.png")';
    } else if (report.status === "Chưa xử lý") {
        el.style.backgroundImage = 'url("/static/images/citizen/report-red.png")';
    }
    el.style.backgroundSize = "cover";
    return el;
}
function createMarkerReport(report) {
    const el = createMarkerElementReport(report);
    const marker = new mapboxgl.Marker(el).setLngLat([report.long, report.lat]).addTo(map);
    marker_report.push(marker);
    // Add event listeners for hover
    const popup = createPopup();
    el.addEventListener("mouseenter", () => mouseEnterReport(el, report, popup));
    el.addEventListener("mouseleave", () => popup.remove());
    el.addEventListener("click", () => toggleSidebar());
}
document.getElementById("switchReport").addEventListener("change", function () {
    if (this.checked) {
        reports = [
            {
                lat: 10.764269039650591,
                long: 106.68471399288329,
                status: "Đã xử lý",
                reportType: "Tố giác sai phạm",
                content: "Đây là báo cáo đến từ bạn"
            },
            {
                lat: 10.764817617443542,
                long: 106.67906482079373,
                status: "Chưa xử lý",
                reportType: "Tố giác sai phạm",
                content: "Đây là báo cáo đến từ bạn"
            }
        ];
        reports.forEach(report => {
            createMarkerReport(report);
        });
    } else {
        marker_report.forEach(function (marker) {
            marker.remove();
        });
        marker_report = [];
    }
});
