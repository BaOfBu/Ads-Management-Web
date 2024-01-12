tinymce.init({
    selector: "#contentArea",
    menubar: false,
    plugins: "image code link autolink lists table media",
    toolbar: [
        "undo redo | bold italic underline strikethrough | numlist bullist | alignleft aligncenter alignright | forecolor backcolor | table link image media | code"
    ],
    image_title: true,
    automatic_uploads: true,
    file_picker_types: "image",
    /* and here's our custom image picker*/
    file_picker_callback: function (cb, value, meta) {
        var input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.onchange = function () {
            var file = this.files[0];
            var reader = new FileReader();
            reader.onload = function () {
                var id = "blobid" + new Date().getTime();
                var blobCache = tinymce.activeEditor.editorUpload.blobCache;
                var base64 = reader.result.split(",")[1];
                var blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);
                cb(blobInfo.blobUri(), { title: file.name });
            };
            reader.readAsDataURL(file);
        };
        input.click();
    }
});
$("#fileImage").fileinput({
    dropZoneEnabled: false,
    maxFileCount: 2,
    allowedFileExtensions: ["jpg", "png", "gif"],
    language: "vi",
    showUpload: false
});
// Access the map
const accessToken = "pk.eyJ1IjoidHRiaW50dCIsImEiOiJjbHBnb282amQwMDVjMmpyeHY5N2c1bXMyIn0.ti-gYOhpihy4YzAFbKuxZQ";
mapboxgl.accessToken = "pk.eyJ1IjoidHRiaW50dCIsImEiOiJjbHBnb282amQwMDVjMmpyeHY5N2c1bXMyIn0.ti-gYOhpihy4YzAFbKuxZQ";

// Initialize the map
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [lng, lat],
    zoom: 15,
    projection: "globe",
    interactive: false
});
const el = document.createElement("div");
el.className = "default-marker";
if (sts == "Đã quy hoạch") {
    el.style.backgroundImage = 'url("/static/images/citizen/ads-blue.png")';
    el.style.backgroundSize = "cover";
    el.style.width = "30px";
    el.style.height = "30px";
    new mapboxgl.Marker(el).setLngLat([Number(lng), Number(lat)]).addTo(map);
} else if (sts === "Chưa quy hoạch") {
    el.style.backgroundImage = 'url("/static/images/citizen/ads-red.png")';
    el.style.backgroundSize = "cover";
    el.style.width = "30px";
    el.style.height = "30px";
    new mapboxgl.Marker(el).setLngLat([Number(lng), Number(lat)]).addTo(map);
} else {
    new mapboxgl.Marker().setLngLat([Number(lng), Number(lat)]).addTo(map);
}

// Return icon
$(".icon-back").on("click", function () {
    window.history.back();
});

// Form
document.getElementById("form-citizen").addEventListener("submit", function (event) {
    event.preventDefault();
    let formData = new FormData();
    let fileInput = document.getElementById("fileImage");
    for (let i = 0; i < fileInput.files.length; i++) {
        formData.append("images", fileInput.files[i]);
    }
    $.ajax({
        url: "http://localhost:8888/get-data/send-report",
        type: "POST",
        data: {
            email: $("#email").val(),
            name: $("#fullname").val(),
            phone: $("#phone").val(),
            content: $("#contentArea").val()
        },
        dataType: "json",
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.error("Error during POST request:", error);
        }
    });
    // let recaptchaResponse = grecaptcha.getResponse();
    // let email = $("#email").val();
    // let name = $("#fullname").val();
    // let phone = $("#phone").val();
    // let content = $("#contentArea").val();
    // if (!recaptchaResponse) {
    //     $("#notification-captcha").css("display", "block");
    // } else {
    //     $("#notification-captcha").css("display", "none");
    // }
    // if (email == "") {
    //     $("#notification-email").css("display", "block");
    // } else {
    //     $("#notification-email").css("display", "none");
    // }
    // if (name == "") {
    //     $("#notification-name").css("display", "block");
    // } else {
    //     $("#notification-name").css("display", "none");
    // }
    // if (phone == "") {
    //     $("#notification-phone").css("display", "block");
    // } else {
    //     if (phone.length > 10) {
    //         $("#notification-phone").css("display", "block");
    //         $("#notification-phone").text("Số điện thoại không hợp lệ");
    //     } else {
    //         $("#notification-phone").css("display", "none");
    //     }
    // }
    // if (content == "") {
    //     $("#notification-contentArea").css("display", "block");
    // } else {
    //     $("#notification-contentArea").css("display", "none");
    // }
});
