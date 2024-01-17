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
    // window.history.back();
    window.location.href = document.referrer;
});

// Form
document.getElementById("form-citizen").addEventListener("submit", function (event) {
    event.preventDefault();
    let email = $("#email").val();
    let name = $("#fullname").val();
    let phone = $("#phone").val();
    let recaptchaResponse = grecaptcha.getResponse();
    let isValid = true;
    if (!recaptchaResponse) {
        $("#notification-captcha").css("display", "block");
        isValid = false;
    } else {
        $("#notification-captcha").css("display", "none");
    }
    if (email == "") {
        $("#notification-email").css("display", "block");
        isValid = false;
    } else {
        $("#notification-email").css("display", "none");
    }
    if (name == "") {
        $("#notification-name").css("display", "block");
        isValid = false;
    } else {
        $("#notification-name").css("display", "none");
    }
    if (phone == "") {
        $("#notification-phone").css("display", "block");
        isValid = false;
    } else {
        if (phone.length > 10) {
            $("#notification-phone").css("display", "block");
            $("#notification-phone").text("Số điện thoại không hợp lệ");
            isValid = false;
        } else {
            $("#notification-phone").css("display", "none");
        }
    }
    let content = tinymce.get("contentArea").getContent();
    if (content.length === 0) {
        $("#notification-contentArea").css("display", "block");
        isValid = false;
    } else {
        $("#notification-contentArea").css("display", "none");
    }
    if (isValid == true) {
        var formData = new FormData();
        var fileInput = document.getElementById("fileImage");
        if (fileInput.files.length > 0) {
            for (var i = 0; i < fileInput.files.length; i++) {
                formData.append("images", fileInput.files[i]);
            }
        }
        var currentDate = new Date();

        var year = currentDate.getFullYear();
        var month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Note: January is 0-based
        var day = String(currentDate.getDate()).padStart(2, "0");
        var hours = String(currentDate.getHours()).padStart(2, "0");
        var minutes = String(currentDate.getMinutes()).padStart(2, "0");
        var seconds = String(currentDate.getSeconds()).padStart(2, "0");

        var formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        formData.append("email", $("#email").val());
        formData.append("name", $("#fullname").val());
        formData.append("phone", $("#phone").val());
        formData.append("content", tinymce.get("contentArea").getContent());
        formData.append("long", lng);
        formData.append("lat", lat);
        formData.append("reportTypeId", $("#reportType").val());
        formData.append("sendDate", formattedDateTime);
        formData.append("adsPanelId", adsPanelId);
        $.ajax({
            url: "http://localhost:8888/get-data/send-report",
            type: "POST",
            data: formData,
            dataType: "json",
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.status == "success") {
                    alert("Gửi báo cáo thành công");
                    // window.history.back();
                    window.location.href = document.referrer;
                }
            },
            error: function (error) {
                console.error("Error during POST request:", error);
            }
        });
    } else {
        event.preventDefault();
        return;
    }
});
