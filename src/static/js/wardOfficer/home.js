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
        let newUrl =
            "/report?adsPanelId=" + "" + "&lat=" + currentMarker._lngLat.lat + "&long=" + currentMarker._lngLat.lng + "&status=" + status;
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
let userWardId = document.getElementById("userWardId").value;
// console.log(userWardId);
// console.log(typeof userWardId);
function updateTheInformationAdsItemForSideBar(ad) {
    const sidebar = document.getElementById("sidebar");
    $.getJSON(`http://localhost:8888/get-data/get-ads-panel/byWard`, { entity: ad.adsLocationId, wardId: userWardId }, function (data) {
        if (data.length > 0) {
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
        $("#sidebar").html(listHtmlSideBar);
        addEvenDetailAdsPanel(ads, data);
        addReportButtonAdsListener(ads.lat, ads.long, ads.status);
    });
}
function addReportButtonAdsListener(lat, long, status) {
    $(".report-button").on("click", function () {
        let adsPanelId = $(this).attr("ads-panel-id");
        let newUrl = "/report?adsPanelId=" + adsPanelId + "&lat=" + lat + "&long=" + long + "&status=" + status;
        window.location.href = newUrl;
    });
}
let listHtmlSideBar;
function addEvenDetailAdsPanel(ad, data) {
    $(".more-information").click(function () {
        var adsPanelId = $(this).attr("ads-panel-id");
        var index = $(this).attr("index");
        listHtmlSideBar = $("#sidebar").html();
        ads = ad;
        const replaceNullValues = obj => {
            return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, value === null ? "Không có" : value]));
        };
        const newData = data.map(replaceNullValues);
        let startDate;
        let endDate;
        if (newData[index].startDate != "Không có") {
            startDate = new Date(newData[index].startDate).toLocaleDateString("en-GB");
        } else {
            startDate = "Không có";
        }
        if (newData[index].endDate != "Không có") {
            endDate = new Date(newData[index].endDate).toLocaleDateString("en-GB");
        } else {
            endDate = "Không có";
        }
        resetTheInformationOfSideBar();
        $("#sidebar").css("padding", "0px");
        console.log("newData[index].license_status", newData[index]);
        if(newData[index].status == "Đã duyệt"){
            $("#sidebar").html(`
            ${
                newData[index].img !== "Không có"
                    ? `<div class="image-detail">
                    <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img src="${newData[index].img}" class="d-block w-100 image-detail-pane" alt="...">
                            </div>
                        </div>
                    </div>
                </div>`
                    : ""
            }
            <div class = "detail-ads-information">
                <h5 id="ads-detail-item-title"><b>${newData[index].adsPanelType}</b></h5>
                <p id="ads-detail-item-address">${ad.location}</p>
                <p id="ads-detail-item-size">Kích thước: <strong>${newData[index].width}m * ${newData[index].height}m</strong></p>
                <p id="ads-detail-item-number">Số lượng: <strong>${newData[index].quantity} trụ/bảng</strong></p>
                <p id="ads-detail-item-ads-type">Hình thức: <strong>${ad.ads_type_name}</strong></p>
                <p id="ads-detai-item-location-type">Phân loại: <strong>${ad.location_type_name}</strong></p>
                <p>Ngày bắt đầu:<b> ${startDate} </b></p>
                <p id="expired-date-item">Ngày hết hạn: <b>${endDate}</b></p>
                <p>Tên công ty:<b> ${newData[index].company}</b> </p>
                <p>Nội dung:<b> ${newData[index].content}</b> </p>
                <p>Email liên lạc công ty: <b>${newData[index].emailCompany}</b> </p>
                <p>Địa chỉ công ty: <b>${newData[index].locationCompany}</b></p>
                <p>Số liên lạc công ty:<b> ${newData[index].phoneCompany}</b></p>
                <div id="button-pane">
                    <button class="return-button" >
                        <i class="bi bi-arrow-return-left"></i>
                        Trở về
                    </button>
                </div>
            </div>
            `);
        }else{
            $("#sidebar").html(`
            ${
                newData[index].img !== "Không có"
                    ? `<div class="image-detail">
                    <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <img src="${newData[index].img}" class="d-block w-100 image-detail-pane" alt="...">
                            </div>
                        </div>
                    </div>
                </div>`
                    : ""
            }
            <div class = "detail-ads-information">
                <h5 id="ads-detail-item-title"><b>${newData[index].adsPanelType}</b></h5>
                <p id="ads-detail-item-address">${ad.location}</p>
                <p id="ads-detail-item-size">Kích thước: <strong>${newData[index].width}m * ${newData[index].height}m</strong></p>
                <p id="ads-detail-item-number">Số lượng: <strong>${newData[index].quantity} trụ/bảng</strong></p>
                <p id="ads-detail-item-ads-type">Hình thức: <strong>${ad.ads_type_name}</strong></p>
                <p id="ads-detai-item-location-type">Phân loại: <strong>${ad.location_type_name}</strong></p>
                <div id="button-pane">
                    <button class="return-button" >
                        <i class="bi bi-arrow-return-left"></i>
                        Trở về
                    </button>
                </div>
            </div>
            `);
        }
        addReturnButtonListener(ad, data);
        addReportButtonAdsListener(ad.lat, ad.long, ad.status);
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
        $.getJSON(`http://localhost:8888/get-data/get-ads-location/byWard`, { wardId: userWardId }, function (data) {
            //console.log(data);
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
    console.log(report.status);
    if (report.status == "Đã xử lý xong") {
        console.log("Đã xử lý xong");
        el.style.backgroundImage = 'url("/static/images/citizen/report-blue.png")';
    } else if (report.status === "Đang xử lý") {
        el.style.backgroundImage = 'url("/static/images/citizen/report-red.png")';
    } else if (report.status === "Chưa xử lý") {
        el.style.backgroundImage = 'url("/static/images/citizen/report-red.png")';
    }
    el.style.backgroundSize = "cover";
    return el;
}
function updateTheInformationReportItemForSideBar(report) {
    const sidebar = document.getElementById("sidebar");
    resetTheInformationOfSideBar();
    $("#sidebar").css("padding", "0px");
    let reportDetailItem = document.createElement("div");
    reportDetailItem.id = "report-detail-item";
    const carouselItems = [];
    if (report.imgId1 != null) {
        carouselItems.push(`
            <div class="carousel-item active">
                <img src="${report.imgId1}" class="d-block w-100 image-detail-pane" alt="Image 1">
            </div>
        `);
    }
    if (report.imgId2 != null) {
        carouselItems.push(`
            <div class="carousel-item ${!report.imgId1 ? "active" : ""}">
                <img src="${report.imgId2}" class="d-block w-100 image-detail-pane" alt="">
            </div>
        `);
    }
    const dateObject = new Date(report.date);
    const formattedDate = dateObject.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
    reportDetailItem.innerHTML = `
        <div class="image-detail">
            <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    ${carouselItems.join("")}
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
        <div class ="report-content">   
            <span class="title-popup-info-report">${report.reportTypeName}</span>
            <span class="report-content-pop-up"><b>Nội dung</b></span>
            <span class="report-content-pop-up">${report.content}</span>
            <span class="report-content-pop-up"><b>Địa chỉ</b></span>
            <span class="report-location">${report.location}</span>
            <span class="status-popup-info-report"><b>Trạng thái</b>: ${report.status}</span>
            <span class="status-popup-info-report"><b>Ngày gửi</b>: ${formattedDate}</span>
        </div>
      
    `;
    sidebar.appendChild(reportDetailItem);
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
        $.getJSON(`http://localhost:8888/get-data/get-report-location/byWard`, { wardId: userWardId }, function (data) {
            if (data === false) {
                alert("Không thể tải dữ liệu từ Server");
            } else {
                console.log(data);
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
