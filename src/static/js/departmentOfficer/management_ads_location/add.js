let modal = document.getElementById('mapModal');
// let currentMarker = null;

modal.style.display = 'none';
mapboxgl.accessToken = "pk.eyJ1IjoidHRiaW50dCIsImEiOiJjbHBnb282amQwMDVjMmpyeHY5N2c1bXMyIn0.ti-gYOhpihy4YzAFbKuxZQ";

const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12?locale=vi",
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
    marker: false,
    language: "vi"
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
    var selectedCoordinates = currentMarker.getLngLat();
    $('#txtCoordinates').val(selectedCoordinates.lat + ', ' + selectedCoordinates.lng);
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedCoordinates.lng},${selectedCoordinates.lat}.json?access_token=${mapboxgl.accessToken}&language=vi`)
    .then(response => response.json())
    .then(data => {
        const address = data.features[0].place_name;
        console.log("Địa chỉ:", address);
        $('#txtLocation').val(address);
    });
});

$(".typeLocation ul.dropdown-menu").on("click", ".dropdown-item", function (event) {
    event.preventDefault();
    console.log("Đã vô");

    let selectedValue = $(this).data("value");
    let selectedId = $(this).data("id");

    console.log("selectedTypeLocation: ", selectedValue);
    $("#selectedWaselectedTypeLocationrd").val(selectedId);
    $("#dropdownTypeLocation").text(selectedValue);
    $("#dropdownTypeLocation").removeClass("is-invalid");
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
    $("#typeAdsPanelError").hide();
});

$('#image').fileinput({
    dropZoneEnabled: false,
    maxFileCount: 1,
    allowedFileExtensions: ['jpg', 'png', 'gif'],
    language: 'vi',
  });
  
  async function uploadAvatar() {
    const fileInput = $("#image")[0].files[0];
    if (!fileInput) {
      console.error('No file selected.');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', fileInput);
    formData.append('adsLocationId', $("#adsLocationId").val());
  
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/upload-image-ads-location',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            delete req.body.image;
            console.log(data);
            resolve(data);
        },
        error: function(error) {
            console.error('Error:', error);
            reject(error);
        }
      });
    });
}



// $("#txtLocation").on("change", function (event) {
//     event.preventDefault();
//     let address = $('#txtLocation');
//     let district = 1;

//     // $('.ward ul.dropdown-menu').empty();
//     $.getJSON(`/department-officer/management-officer/list-ward?district=${district}`, function (data) {
//         if(data != false){
//             for (let p of data) {
//                 let newItem = '<li><a class="dropdown-item" data-value="' + p.name + '">' + p.name + '</a></li>';
//                 console.log(newItem);
//                 $(".ward ul.dropdown-menu").append(newItem);
//             }
//         }else{
//             $("#selectedWard").val("");
//             $("#dropdownWard").text("Phường");
//             $("#wardError").hide();
//         }  
//     });
// });

// $(".ward ul.dropdown-menu").on("click", ".dropdown-item", function (event) {
//     event.preventDefault();
//     console.log("Đã vô");

//     let selectedValue = $(this).data("value");
//     console.log("selectedWard: ", selectedValue);
//     $("#selectedWard").val(selectedValue);
//     $("#dropdownWard").text(selectedValue);
//     $("#dropdownWard").removeClass("is-invalid");
//     $("#wardError").hide();
// });



// $('#submitButton').on('click', function(){
//     var selectedCoordinates = currentMarker.getLngLat();
//     $('#txtCoordinates').val(selectedCoordinates.lng + ', ' + selectedCoordinates.lat);
//     fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${selectedCoordinates.lng},${selectedCoordinates.lat}.json?access_token=${mapboxgl.accessToken}&language=vi`)
//         .then(response => response.json())
//         .then(data => {
//             const address = data.features[0].place_name;
//             console.log("Địa chỉ:", address);
//             $('#txtLocation').val(address);
//         });
//     modal.style.display = 'none';
// });

// $('#chooseCoordinate').click(function () {
//     modal.style.display = 'block';
// });

// $('#backButton').click(function (){
//     modal.style.display = 'none';
// });