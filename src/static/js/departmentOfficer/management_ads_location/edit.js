$(document).ready(function () {
    const selectedTypeLocation = $('#selectedTypeLocation').val();
    const selectedTypeAdsPanel = $('#selectedTypeAdsPanel').val();

    console.log('selectedTypeLocation: ', selectedTypeLocation);

    $(`.typeLocation .dropdown-menu .dropdown-item[data-id="${selectedTypeLocation}"]`).addClass('active');
    $(`.typeAdsPanel .dropdown-menu .dropdown-item[data-id="${selectedTypeAdsPanel}"]`).addClass('active');

    mapboxgl.accessToken = "pk.eyJ1IjoidHRiaW50dCIsImEiOiJjbHBnb282amQwMDVjMmpyeHY5N2c1bXMyIn0.ti-gYOhpihy4YzAFbKuxZQ";

    const temp = $('#txtCoordinates').val();
    const split = temp.split(", ");
    const userLocation = [parseFloat(split[1]), parseFloat(split[0])];
    console.log("userLocation: ", userLocation);
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12?locale=vi",
        center: userLocation,
        zoom: 18,
        projection: "globe"
    });
    let currentMarker = null;
    addOrUpdateMarker(userLocation);

    function addOrUpdateMarker(newLocation) {
        if (!currentMarker) {
            currentMarker = new mapboxgl.Marker().setLngLat(newLocation).addTo(map);
        } else {

            currentMarker.setLngLat(newLocation);
        }
    }

    map.addControl(new mapboxgl.FullscreenControl());

    map.addControl(new mapboxgl.NavigationControl());

    let geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: "Tìm kiếm theo địa chỉ",
        zoom: 15,
        marker: false,
        language: "vi"
    });
    map.addControl(geocoder, "top-left");

    $('#image').fileinput({
        dropZoneEnabled: false,
        maxFileCount: 1,
        allowedFileExtensions: ['jpg', 'png', 'gif'],
        language: 'vi',
    });

    async function uploadImage() {
        console.log("Đã vô đây");
        let fileInput = $("#image")[0].files[0];
        if (!fileInput) {
        console.error('No file selected.');
        return;
        }

        const filename = $('#imgId').val() + '.' + fileInput.name.split(".").pop();

        const newFile = new File([fileInput], filename, { type: fileInput.type, lastModified: fileInput.lastModified });

        const formData = new FormData();
        formData.append('image', newFile);
        formData.append('imgId', $('#imgId').val());
    
        return new Promise((resolve, reject) => {
        $.ajax({
            url: '/department-officer/ads-location/upload-image',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(data) {
                console.log("data: ", data);
                resolve(data);
            },
            error: function(error) {
                console.error('Error:', error);
                reject(error);
            }
        });
        });
    }

    geocoder.on("result", function (event) {
        let coordinates = event.result.geometry.coordinates;
        if (currentMarker) {
            currentMarker.remove();
        }
        currentMarker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
        let selectedCoordinates = currentMarker.getLngLat();
        $('#txtCoordinates').val(selectedCoordinates.lat + ', ' + selectedCoordinates.lng);
        $.ajax({
            url: "/department-officer/ads-location/get-address", 
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ lat: selectedCoordinates.lat, long: selectedCoordinates.lng }),
            success: function(response) {
                $('#txtLocation').val(response.location);
                $('#wardId').val(response.wardId);
                $('#districtId').val(response.districtId);
                console.log("wardId: ", response.wardId);
                console.log("districtId: ", response.districtId);
            },
            error: function(error) {
            }
        });
    });

    map.on("click", function (e) {
        let coordinates = e.lngLat;
        if (currentMarker) {
            currentMarker.remove();
        }
        currentMarker = new mapboxgl.Marker().setLngLat(coordinates).addTo(map);
        let selectedCoordinates = currentMarker.getLngLat();
        $('#txtCoordinates').val(selectedCoordinates.lat + ', ' + selectedCoordinates.lng);
        $.ajax({
            url: "/department-officer/ads-location/get-address", 
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ lat: selectedCoordinates.lat, long: selectedCoordinates.lng }),
            success: function(response) {
                $('#txtLocation').val(response.location);
                $('#wardId').val(response.wardId);
                $('#districtId').val(response.districtId);
                console.log("wardId: ", response.wardId);
                console.log("districtId: ", response.districtId);
            },
            error: function(error) {
            }
        });
    });

    $(".typeLocation ul.dropdown-menu").on("click", ".dropdown-item", function (event) {
        event.preventDefault();
        console.log("Đã vô");

        let selectedValue = $(this).data("value");
        let selectedId = $(this).data("id");

        console.log("selectedTypeLocation: ", selectedValue);
        $("#selectedTypeLocation").val(selectedId);
        $("#dropdownTypeLocation").text(selectedValue);
        $("#dropdownTypeLocation").removeClass("is-invalid");
        $('.typeLocation .dropdown-menu .dropdown-item').removeClass('active');
        $(this).addClass('active');
        $("#typeLocationError").hide();
    });

    $(".typeAdsPanel ul.dropdown-menu").on("click", ".dropdown-item", function (event) {
        event.preventDefault();
        console.log("Đã vô");

        let selectedValue = $(this).data("value");
        let selectedId = $(this).data("id");

        console.log("selectedTypeAdsPanel: ", selectedValue);
        $("#selectedTypeAdsPanel").val(selectedId);
        $("#dropdownAdsPanel").text(selectedValue);
        $("#dropdownAdsPanel").removeClass("is-invalid");
        $('.typeAdsPanel .dropdown-menu .dropdown-item').removeClass('active');
        $(this).addClass('active');
        $("#typeAdsPanelError").hide();
    });

    $("#btnDelete").on("click", function() {
        $("#action").val("del");
        $("#frmEdit").submit();
        alert("Bạn đã xóa bảng quảng cáo này thành công!");
    });
    
    $("#submitButton").on("click", function() {
        $.ajax({
            url: "/department-officer/ads-location/is-available", 
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ location: $('#txtLocation').val() }),
            success: async function(response) {
                if(response.ads_location === undefined || response.ads_location.adsLocationId.toString() === $('#adsLocationId').val()) {
                    try {
                        await uploadImage();
                        console.log("Upload thành công");
                        $("#action").val("patch");
                        $("#frmEdit").submit();
                        alert("Đã thay đổi thông tin điểm đặt bảng quảng cáo thành công!!!");
                        window.location.reload();
                    } catch (error) {
                        console.log('Error during image upload:', error);
                    }
                    
                } else {
                    alert("Thay đổi thông tin địa điểm đặt quảng cáo không thành công. Điểm đặt quảng cáo này đã có. Vui lòng chọn điểm đặt quảng cáo khác.!!!");
                    window.location.reload();
                }
            },
            error: function(error) {
                console.log('Lỗi trong quá trình xác nhận địa chỉ có hợp lệ không:', error);
            }
        });
    });
});