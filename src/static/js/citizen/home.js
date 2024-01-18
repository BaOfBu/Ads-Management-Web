// Access the map
const accessToken = "pk.eyJ1IjoidHRiaW50dCIsImEiOiJjbHBnb282amQwMDVjMmpyeHY5N2c1bXMyIn0.ti-gYOhpihy4YzAFbKuxZQ";
mapboxgl.accessToken = "pk.eyJ1IjoidHRiaW50dCIsImEiOiJjbHBnb282amQwMDVjMmpyeHY5N2c1bXMyIn0.ti-gYOhpihy4YzAFbKuxZQ";
// Initialize the map
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [106.68223, 10.762649],
    zoom: 16,
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
    const sidebar = document.getElementById("sidebar");
    const button = document.getElementById("toggleSidebarButton");
    sidebar.style.width = "0px";
    button.style.display = "none";
});
// Update the information for the point without marker
function updateSideBarWithEmptyPoint() {
    const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${currentMarker._lngLat.lng},${currentMarker._lngLat.lat}.json?access_token=${accessToken}`;
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const sidebar = document.getElementById("sidebar");
            const features = data.features;
            console.log(features);
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
                addReportButtonForEmptyLocation();
            } else {
                console.log("No results found.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });
}
function addReportButtonForEmptyLocation() {
    $(".report-button").on("click", function () {
        let newUrl = "/report?adsPanelId=" + "" + "&lat=" + currentMarker._lngLat.lat + "&long=" + currentMarker._lngLat.lng + "&status=";
        window.location.href = newUrl;
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
    sidebar.style.width = "700px";
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
let adsGeoJSON = {
    type: "FeatureCollection",
    features: []
};
function createGeoJSONFeature(ad) {
    return {
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: [ad.long, ad.lat]
        },
        properties: {
            ads_type_name: ad.ads_type_name,
            location_type_name: ad.location_type_name,
            location: ad.location,
            status: ad.status
        }
    };
}
function createMarkerAds(ad) {
    const el = createMarkerElementAds(ad);
    // const marker = new mapboxgl.Marker(el).setLngLat([ad.long, ad.lat]).addTo(map);
    const marker = new mapboxgl.Marker(el).setLngLat([ad.long, ad.lat]);
    marker_ads.push(marker);
    const geoJSONFeature = createGeoJSONFeature(ad);
    adsGeoJSON.features.push(geoJSONFeature);
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
let clustersVisibleAds = null;
function addClusterAds() {
    map.addSource("earthquakes-daquyhoach", {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: adsGeoJSON.features.filter(feature => feature.properties.status === "Đã quy hoạch") || []
        },
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 50
    });

    map.addSource("earthquakes-chuaquyhoach", {
        type: "geojson",
        data: {
            type: "FeatureCollection",
            features: adsGeoJSON.features.filter(feature => feature.properties.status === "Chưa quy hoạch") || []
        },
        cluster: true,
        clusterMaxZoom: 13,
        clusterRadius: 50
    });
    // Cluster layer for "Đã quy hoạch" status
    map.addLayer({
        id: "clusters-daquyhoach",
        type: "circle",
        source: "earthquakes-daquyhoach",
        filter: ["has", "point_count"],
        paint: {
            "circle-color": "#5169d6",
            "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40]
        }
    });
    // Cluster layer for "Chưa quy hoạch" status
    map.addLayer({
        id: "clusters-chuaquyhoach",
        type: "circle",
        source: "earthquakes-chuaquyhoach",
        filter: ["has", "point_count"],
        paint: {
            "circle-color": "#4b4b4d",
            "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40]
        }
    });
    // Cluster count for "Đã quy hoạch" status
    map.addLayer({
        id: "cluster-count-daquyhoach",
        type: "symbol",
        source: "earthquakes-daquyhoach",
        filter: ["has", "point_count"],
        layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12
        },
        paint: {
            "text-color": "#ffffff"
        }
    });
    // Cluster count for "Chưa quy hoạch" status
    map.addLayer({
        id: "cluster-count-chuaquyhoach",
        type: "symbol",
        source: "earthquakes-chuaquyhoach",
        filter: ["has", "point_count"],
        layout: {
            "text-field": "{point_count_abbreviated}",
            "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
            "text-size": 12
        },
        paint: {
            "text-color": "#ffffff"
        }
    });
}
function removeClusterAds() {
    clustersVisibleAds = null;
    adsGeoJSON.features = [];
    var clusterLayerIds = ["clusters-daquyhoach", "clusters-chuaquyhoach", "cluster-count-daquyhoach", "cluster-count-chuaquyhoach"];
    var clusterSourceIds = ["earthquakes-daquyhoach", "earthquakes-chuaquyhoach"];
    clusterLayerIds.forEach(function (layerId) {
        if (map.getLayer(layerId)) {
            map.removeLayer(layerId);
        }
    });
    clusterSourceIds.forEach(function (sourceId) {
        if (map.getSource(sourceId)) {
            map.removeSource(sourceId);
        }
    });
}
// Add an event listener for map load
function updateClusterVisibility() {
    var currentZoom = map.getZoom();
    if (currentZoom <= 13) {
        if (clustersVisibleAds == null) {
            map.on("load", addClusterAds());
        }
        marker_ads.forEach(function (marker) {
            marker.remove();
        });
        map.setLayoutProperty("clusters-daquyhoach", "visibility", "visible");
        map.setLayoutProperty("clusters-chuaquyhoach", "visibility", "visible");
        map.setLayoutProperty("cluster-count-daquyhoach", "visibility", "visible");
        map.setLayoutProperty("cluster-count-chuaquyhoach", "visibility", "visible");
        // map.setLayoutProperty("unclustered-point", "visibility", "visible");
        clustersVisibleAds = true;
    } else {
        if (clustersVisibleAds == null) {
            map.on("load", addClusterAds());
        }
        map.setLayoutProperty("clusters-daquyhoach", "visibility", "none");
        map.setLayoutProperty("clusters-chuaquyhoach", "visibility", "none");
        map.setLayoutProperty("cluster-count-daquyhoach", "visibility", "none");
        map.setLayoutProperty("cluster-count-chuaquyhoach", "visibility", "none");
        // map.setLayoutProperty("unclustered-point", "visibility", "none");
        clustersVisibleAds = false;
        marker_ads.forEach(function (marker) {
            marker.addTo(map);
        });
    }
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
    $.getJSON(`http://localhost:8888/get-data/get-ads-panel`, { entity: ad.adsLocationId }, function (data) {
        if (data.length > 0) {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                let adsDetailItem = document.createElement("div");
                adsDetailItem.id = "ads-detail-item";
                adsDetailItem.innerHTML = `
                <h5 id="ads-detail-item-title">${data[i].adsPanelType}</h5>
                <p id="ads-detail-item-address">${ad.location}</p>
                <p id="ads-detail-item-size">Kích thước: <strong>${data[i].width}m * ${data[i].height}m</strong></p>
                <p id="ads-detail-item-number">Số lượng: <strong>${data[i].quantity} trụ/bảng</strong></p>
                <p id="ads-detail-item-ads-type">Hình thức: <strong>${ad.ads_type_name}</strong></p>
                <p id="ads-detai-item-location-type">Phân loại: <strong>${ad.location_type_name}</strong></p>
                <div id="button-pane">
                    <button class="more-information" ads-panel-id=${data[i].adsPanelId} index=${i}><i class="bi bi-info-circle"></i></button>
                    <button class="report-button" ads-panel-id="${data[i].adsPanelId}">
                        <i class="bi bi-exclamation-octagon-fill"></i>
                        BÁO CÁO VI PHẠM
                    </button>
                </div>
            `;
                sidebar.appendChild(adsDetailItem);
            }
            addEvenDetailAdsPanel(ad, data);
            addReportButtonAdsListener(ad.lat, ad.long, ad.status);
        } else {
            let adsDetailItem = document.createElement("div");
            adsDetailItem.id = "no-ads-detail-item";
            adsDetailItem.innerHTML = `
            <h4 class="mb-3"> <b>Địa điểm chưa có bảng đặt quảng cáo</b> </h4>
            <img src="/static/images/citizen/no-ads-panel.jpg"></img>
            `;
            sidebar.appendChild(adsDetailItem);
        }
    });
}
function addReturnButtonListener(ads, data) {
    $(".return-button").click(function () {
        resetTheInformationOfSideBar();
        updateTheInformationAdsItemForSideBar(ads);
        addEvenDetailAdsPanel(ads, data);
        addReportButtonAdsListener(ads.lat, ads.long, ads.status);
    });
}
function addReportButtonAdsListener(lat, long, status) {
    $(".report-button").on("click", function () {
        let adsPanelId = $(this).attr("ads-panel-id");
        $.getJSON(`http://localhost:8888/get-data/send-report/check-ads-panel-report`, { adsPanelId: adsPanelId }, function (data) {
            if (data == false) {
                alert("Bảng quảng cáo này bạn đã gửi báo cáo");
            } else {
                let newUrl = "/report?adsPanelId=" + adsPanelId + "&lat=" + lat + "&long=" + long + "&status=" + status;
                window.location.href = newUrl;
            }
        });
    });
}
let listHtmlSideBar;
function addEvenDetailAdsPanel(ad, data) {
    $(".more-information").click(function () {
        var index = $(this).attr("index");
        var adsPanelId = $(this).attr("ads-panel-id");
        if (data[index].status != "Đã duyệt" || data[index].licenseId == null) {
            alert("Bảng quảng cáo hiện chưa có cấp phép quảng cáo");
            return;
        } else {
            endDate = new Date(data[index].endDate).toLocaleDateString("en-GB");
            listHtmlSideBar = $("#sidebar").html();
            ads = ad;
            resetTheInformationOfSideBar();
            $("#sidebar").css("padding", "0px");
            $("#sidebar").html(`
            <div class="image-detail">
                <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                        <img src="${data[index].img}" class="d-block w-100 image-detail-pane" alt="...">
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class = "detail-ads-information">
                <h5 id="ads-detail-item-title"><b>${data[index].adsPanelType}</b></h5>
                <p id="ads-detail-item-address">${ad.location}</p>
                <p id="ads-detail-item-size">Kích thước: <strong>${data[index].width}m * ${data[index].height}m</strong></p>
                <p id="ads-detail-item-number">Số lượng: <strong>${data[index].quantity} trụ/bảng</strong></p>
                <p id="ads-detail-item-ads-type">Hình thức: <strong>${ad.ads_type_name}</strong></p>
                <p id="ads-detai-item-location-type">Phân loại: <strong>${ad.location_type_name}</strong></p>
                <p id="expired-date-item">Ngày hết hạn: <b>${endDate}</b></p>
                <div id="button-pane">
                    <button class="report-button" ads-panel-id="${adsPanelId}">
                        <i class="bi bi-exclamation-octagon-fill"></i>
                        BÁO CÁO VI PHẠM
                    </button>
                    <button class="return-button" >
                        <i class="bi bi-arrow-return-left"></i>
                        Trở về
                    </button>
                </div>
            </div>
            `);
            addReturnButtonListener(ad, data);
            addReportButtonAdsListener(ad.lat, ad.long, ad.status);
        }
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
                updateClusterVisibility();
                map.on("zoom", function () {
                    updateClusterVisibility();
                });
            }
        });
    } else {
        marker_ads.forEach(function (marker) {
            marker.remove();
        });
        marker_ads = [];
        removeClusterAds();
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
                    <span class="title-popup-info">${report.reportTypeName}</span>
                    <span class="report-content-pop-up">${report.content}</span>
                    <span class="report-location">${report.location}</span>
                    <span class="status-popup-info">${report.status}</span>
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
    if (report.status === "Đã xử lý xong") {
        el.style.backgroundImage = 'url("/static/images/citizen/report-blue.png")';
    } else if (report.status === "Đang xử lý") {
        el.style.backgroundImage = 'url("/static/images/citizen/report-red.png")';
    } else if (report.status === "Chưa xử lý") {
        el.style.backgroundImage = 'url("/static/images/citizen/report-red.png")';
    }
    el.style.backgroundSize = "cover";
    return el;
}
function returnButtonReport(data) {
    $(".return-button-report").click(function () {
        console.log("object");
        resetTheInformationOfSideBar();
        updateTheInformationReportItemForSideBar(data[0]);
        addEventDetailReportPanel(data);
    });
}
let reportHtml;
function updateTheInformationReportItemForSideBar(report) {
    // Empty point
    if (report.adsPanelId == null) {
        addEventDetailReportPanel(report);
        return;
    }
    // report panel
    $.getJSON(`http://localhost:8888/get-data/get-report-location/get-report-panel`, { id: report.adsLocationId }, function (data) {
        if (data.length > 0) {
            console.log(data);
            for (let i = 0; i < data.length; i++) {
                const dateObject = new Date(data[i].date);
                const formattedDate = dateObject.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
                let adsDetailItem = document.createElement("div");
                adsDetailItem.id = "ads-detail-item";
                adsDetailItem.innerHTML = `
                            <h5 style="color:#176B87;font-size:22px;margin-top:20px;"><b>Thông tin bảng quảng cáo</b></h5>
                            <h5 id="ads-detail-item-title"><b>${data[i].ads_panel_type_name}</b></h5>
                            <p id="ads-detail-item-address">${data[i].location}</p>
                            <p id="ads-detail-item-size">Kích thước: <strong>${data[i].ads_panel_width}m * ${data[i].ads_panel_height}m</strong></p>
                            <p id="ads-detail-item-number">Số lượng: <strong>${data[i].ads_panel_quantity} trụ/bảng</strong></p>
                            <p id="ads-detail-item-ads-type">Hình thức: <strong>${data[i].ads_type}</strong></p>
                            <p id="ads-detai-item-location-type">Phân loại: <strong>${data[i].location_type}</strong></p>
                            <h5 style="color:#176B87;font-size:22px;margin-top:20px;"><b>Thông tin báo cáo</b></h5>
                            <h5 id="ads-detail-item-title"><b>${data[i].reportTypeName}</b></h5>
                            <p id="ads-detail-item-size"><strong>Nội dung</strong></p>
                            ${data[i].content}
                            <p><strong>Ngày gửi</strong>: ${formattedDate}</p>
                            <p><strong>Trạng thái: ${data[i].status}</strong></p>
                            <div id="button-pane">
                                <button class="more-information" report-detail-item=${i}><i class="bi bi-info-circle"></i></button>
                            </div>
                        `;
                sidebar.appendChild(adsDetailItem);
                addEventDetailReportPanel(data);
                reportHtml = $("#sidebar").html();
            }
        } else {
        }
    });
}
function addEventDetailReportPanel(data) {
    if (data.adsPanelId == null && data.length == undefined) {
        const sidebar = document.getElementById("sidebar");
        resetTheInformationOfSideBar();
        $("#sidebar").css("padding", "0px");
        let reportDetailItem = document.createElement("div");
        reportDetailItem.id = "report-detail-item";
        const carouselItems = [];
        if (data.imgId1 != null) {
            carouselItems.push(`
            <div class="carousel-item active">
                <img src="${data.imgId1}" class="d-block w-100 image-detail-pane" alt="Image 1">
            </div>
        `);
        }
        if (data.imgId2 != null) {
            carouselItems.push(`
            <div class="carousel-item ${!data.imgId1 ? "active" : ""}">
                <img src="${data.imgId2}" class="d-block w-100 image-detail-pane" alt="">
            </div>
        `);
        }
        const dateObject = new Date(data.date);
        const formattedDate = dateObject.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
        reportDetailItem.innerHTML = `
        <div class="image-detail">
            <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    ${carouselItems.join("")}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden"></span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden"></span>
                </button>
            </div>
        </div>
        <div class ="report-content">   
            <span class="title-popup-info-report">${data.reportTypeName}</span>
            <span class="report-content-pop-up"><b>Nội dung</b></span>
            <span class="report-content-pop-up">${data.content}</span>
            <span class="report-content-pop-up"><b>Địa chỉ</b></span>
            <span class="report-location">${data.location}</span>
            <span class="status-popup-info-report"><b>Trạng thái: ${data.status}</b></span>
            <span class="status-popup-info-report"><b>Ngày gửi</b>: ${formattedDate}</span>
            ${data.handlingProcedureInfor ? `<span class=""><b>Giải quyết</b>: ${data.handlingProcedureInfor}</span>` : ""}
        </div>`;
        sidebar.appendChild(reportDetailItem);
    } else {
        $(".more-information").click(function () {
            var reportId = $(this).attr("report-detail-item");
            const sidebar = document.getElementById("sidebar");
            resetTheInformationOfSideBar();
            $("#sidebar").css("padding", "0px");
            let reportDetailItem = document.createElement("div");
            reportDetailItem.id = "report-detail-item";
            const carouselItems = [];
            if (data[reportId].imgId1 != null) {
                carouselItems.push(`
                <div class="carousel-item active">
                    <img src="${data[reportId].imgId1}" class="d-block w-100 image-detail-pane" alt="Image 1">
                </div>
            `);
            }
            if (data[reportId].imgId2 != null) {
                carouselItems.push(`
                <div class="carousel-item ${!data[reportId].imgId1 ? "active" : ""}">
                    <img src="${data[reportId].imgId2}" class="d-block w-100 image-detail-pane" alt="">
                </div>
            `);
            }
            const dateObject = new Date(data[reportId].date);
            const formattedDate = dateObject.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
            reportDetailItem.innerHTML = `
            <div class="image-detail">
                <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
                    <div class="carousel-inner">
                        ${carouselItems.join("")}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden"></span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden"></span>
                    </button>
                </div>
            </div>
            <div class ="report-content">   
                <span class="title-popup-info-report">${data[reportId].reportTypeName}</span>
                <span class="report-content-pop-up"><b>Nội dung</b></span>
                <span class="report-content-pop-up">${data[reportId].content}</span>
                <span class="report-content-pop-up"><b>Địa chỉ</b></span>
                <span class="report-location">${data[reportId].location}</span>
                <span class="status-popup-info-report"><b>Trạng thái: ${data[reportId].status}</b></span>
                <span class="status-popup-info-report"><b>Ngày gửi</b>: ${formattedDate}</span>
                ${
                    data[reportId].handlingProcedureInfor
                        ? `<span class=""><b>Giải quyết</b>: ${data[reportId].handlingProcedureInfor}</span>`
                        : ""
                }
                <button class="return-button-report" >
                    <i class="bi bi-arrow-return-left"></i>Trở về
                </button>
            </div>`;
            sidebar.appendChild(reportDetailItem);
            returnButtonReport(data);
        });
    }
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
        resetTheInformationOfSideBar();
        updateTheInformationReportItemForSideBar(report);
        toggleSidebar();
        isMarker = true;
    });
}
document.getElementById("switchReport").addEventListener("change", function () {
    if (this.checked) {
        $.getJSON(`http://localhost:8888/get-data/get-report-location`, function (data) {
            if (data === false) {
                alert("Không thể tải dữ liệu từ Server");
            } else {
                data.forEach(report => {
                    createMarkerReport(report);
                });
            }
        });
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
// Button to return the user location
document.getElementById("return-location").addEventListener("click", function () {
    resetTheInformationOfSideBar();
    const sidebar = document.getElementById("sidebar");
    const button = document.getElementById("toggleSidebarButton");
    sidebar.style.width = "0px";
    button.style.display = "none";
    navigator.geolocation.getCurrentPosition(position => {
        const userLocation = [position.coords.longitude, position.coords.latitude];
        map.setCenter(userLocation);
        if (currentMarker) {
            currentMarker.remove();
        }
        currentMarker = new mapboxgl.Marker().setLngLat(userLocation).addTo(map);
    });
    map.flyTo({
        center: map.getCenter(),
        zoom: map.getZoom(),
        speed: 1.5
    });
});
