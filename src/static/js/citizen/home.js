// Access the map
const accessToken = "pk.eyJ1IjoidHRiaW50dCIsImEiOiJjbHBnb282amQwMDVjMmpyeHY5N2c1bXMyIn0.ti-gYOhpihy4YzAFbKuxZQ";
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
let isMarker = false;

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
// Update the information for the point without marker
function updateSideBarWithEmptyPoint() {
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${currentMarker._lngLat.lng},${currentMarker._lngLat.lat}.json?access_token=${accessToken}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const sidebar = document.getElementById("sidebar");
            const features = data.features;
            if (features.length > 0) {
                const firstFeature = features[0];
                const place = firstFeature.place_name;
                const parts = place.split(",");
                const trimmedParts = parts.map(part => part.trim());
                let address = "";
                for (let i = 1; i < trimmedParts.length; i++) {
                    address = address + trimmedParts[i] + ", ";
                }
                const div = document.createElement("div");
                div.innerHTML = `
                <div id="detail-empty-info">
                    <div id="ads-info">
                        <div class="ads-info-icon">
                            <i class="bi bi-info-circle"></i>
                        </div>
                        <div id="ads-info-text">
                            <h6>Thông tin bảng quảng cáo</h6>
                            <div id="ads-content">
                                <p>Chưa có dữ liệu!</p>
                                <p>Vui lòng chọn điểm trên bản đồ để xem.</p>
                            </div>
                        </div>
                    </div>
                    <div id="location-info">
                        <div class="location-info-icon">
                            <i class="bi bi-check2-circle"></i>
                        </div>
                        <div id="location-info-text">
                            <h6>Thông tin địa điểm</h6>
                            <div id="location-content">
                                <p>${trimmedParts[0]}</p>
                                <p>${address}</p>
                            </div>
                            <button class="report-button">
                                <i class="bi bi-exclamation-octagon-fill"></i>
                                BÁO CÁO VI PHẠM
                            </button>
                        </div>
                    </div>
                </div>
                `;
                sidebar.appendChild(div);
            } else {
                console.log("No results found.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
map.on("click", function (e) {
    let coordinates = e.lngLat;
    if (currentMarker) {
        currentMarker.remove();
    }
    currentMarker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
    if (isMarker == true) {
        isMarker = false;
        return;
    }
    if (isMarker == false) {
        resetTheInformationOfSideBar();
        updateSideBarWithEmptyPoint();
        toggleSidebar();
    }
});

// Function default for Switch
function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const button = document.getElementById("toggleSidebarButton");
    sidebar.style.width = "600px";
    button.style.display = "block";
    button.addEventListener("click", () => {
        resetTheInformationOfSideBar();
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
// Listener for click into the ads location
function updateTheInformationAdsItemForSideBar(ad) {
    const sidebar = document.getElementById("sidebar");
    const limit = 2;
    const page = 1;
    const offset = (page - 1) * limit;
    const start = 1;
    const end = 5;
    for (let i = start; i <= end; i++) {
        let adsDetailItem = document.createElement("div");
        adsDetailItem.id = "ads-detail-item";
        adsDetailItem.innerHTML = `
        <h5 id="ads-detail-item-title">Trụ, cụm Pano</h5>
        <p id="ads-detail-item-address">217 Nguyễn Văn Cừ St., Dist. 5, Ho Chi Minh City, 748400, Vietnam</p>
        <p id="ads-detail-item-size">Kích thước: <strong>2.5m * 10m</strong></p>
        <p id="ads-detail-item-number">Số lượng: <strong>1 trụ/bảng</strong></p>
        <p id="ads-detail-item-ads-type">Hình thức: <strong>Cổ động chính trị</strong></p>
        <p id="ads-detai-item-location-type">Phân loại: <strong>Đất công cộng viên/Hành lang an toàn giao thông</strong></p>
        <div id="button-pane">
            <button class="more-information"><i class="bi bi-info-circle"></i></button>
            <button class="report-button">
                <i class="bi bi-exclamation-octagon-fill"></i>
                BÁO CÁO VI PHẠM
            </button>
        </div>
    `;
        sidebar.appendChild(adsDetailItem);
    }
    addEvenDetailAdsPanel();
}
function addEvenDetailAdsPanel() {
    $(".more-information").click(function () {
        resetTheInformationOfSideBar();
        $("#sidebar").css("padding", "0px");
        $("#sidebar").html(`
        <img class="img-detail-panel" src="../../static/images/citizen/test.jpg" alt="" />
        `);
    });
}
function createMarkerAds(ad) {
    const el = createMarkerElementAds(ad);
    const marker = new mapboxgl.Marker(el).setLngLat([ad.long, ad.lat]).addTo(map);
    marker_ads.push(marker);
    // Add event listeners for hover
    const popup = createPopup();
    el.addEventListener("mouseenter", () => mouseEnterAds(el, ad, popup));
    el.addEventListener("mouseleave", () => popup.remove());
    el.addEventListener("click", () => {
        resetTheInformationOfSideBar();
        updateTheInformationAdsItemForSideBar(ad);
        toggleSidebar();
        isMarker = true;
    });
}
document.getElementById("switchAds").addEventListener("change", function () {
    if (this.checked) {
        $.getJSON(`http://localhost:8888/get-data/get-ads-location`, function (data) {
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
    el.addEventListener("click", () => {
        isMarker = true;
        toggleSidebar();
    });
}
document.getElementById("switchReport").addEventListener("change", function () {
    if (this.checked) {
        $.getJSON(`http://localhost:8888/get-data/get-report-location`, function (data) {});
    } else {
        marker_report.forEach(function (marker) {
            marker.remove();
        });
        marker_report = [];
    }
});

// Listen click the point in the map
function resetTheInformationOfSideBar() {
    $("#sidebar").css("padding-top", "30px");
    $("#sidebar").html("");
}
