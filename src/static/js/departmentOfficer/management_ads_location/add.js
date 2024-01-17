$(document).ready(function () {
    $('.typeLocation .dropdown-menu .dropdown-item:first').addClass('active');
    $('.typeAdsPanel .dropdown-menu .dropdown-item:first').addClass('active');

    mapboxgl.accessToken = "pk.eyJ1IjoidHRiaW50dCIsImEiOiJjbHBnb282amQwMDVjMmpyeHY5N2c1bXMyIn0.ti-gYOhpihy4YzAFbKuxZQ";

    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v12?locale=vi",
        center: [106.68223, 10.762649],
        zoom: 18,
        projection: "globe"
    });

    let currentMarker = null;

    navigator.geolocation.getCurrentPosition(position => {
        const userLocation = [position.coords.longitude, position.coords.latitude];
        map.setCenter(userLocation);
        if (currentMarker) {
            currentMarker.remove();
        }
        currentMarker = new mapboxgl.Marker().setLngLat(userLocation).addTo(map);
    });

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

    $("#submitButton").on("click", function(event) {
        let isValid = true; 
        event.preventDefault();
    
        if(!$('#txtCoordinates').val()){
            isValid = false;
            $('#errorLocation').show();
            $('#errorImage').hide();
            $('#errorAvailable').hide();
        }
        if(!$('#image').val() && isValid){
            isValid = false;
            $('#errorImage').show();
            $('#errorLocation').hide();
            $('#errorAvailable').hide();
        }

        // event.preventDefault();

        if(isValid){
            $.ajax({
                url: "/department-officer/ads-location/is-available", 
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({ location: $('#txtLocation').val() }),
                success: async function(response) {
                    if(response.ads_location) {
                        console.log("length lớn: ", response);
                        isValid = false;
                        $('#errorAvailable').show();
                        $('#errorLocation').hide();
                        $('#errorImage').hide();
                        event.preventDefault();
                    }else{
                        if(isValid){
                            try {
                                await uploadImage();
                                console.log("Upload thành công");
                                $("#frmAdd").submit();
                                alert("Đã thêm điểm đặt bảng quảng cáo thành công!!!");
                            } catch (error) {
                                console.log('Error during image upload:', error);
                            }
                        }else{
                            event.preventDefault();
                        } 
                    }
                },
                error: function(error) {
                    console.log('Lỗi trong quá trình xác nhận địa chỉ có hợp lệ không:', error);
                }
            });
        }

        
        
    });

    geocoder.on("result", function (event) {
        var coordinates = event.result.geometry.coordinates;
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
});