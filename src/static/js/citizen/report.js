tinymce.init({
    selector: "#contentArea",
    menubar: false,
    plugins: "image link autolink lists table media",
    toolbar: [
        "undo redo | bold italic underline strikethrough | numlist bullist | alignleft aligncenter alignright | forecolor backcolor | table link image media"
    ]
});
// Access the map
const accessToken = "pk.eyJ1IjoidHRiaW50dCIsImEiOiJjbHBnb282amQwMDVjMmpyeHY5N2c1bXMyIn0.ti-gYOhpihy4YzAFbKuxZQ";
mapboxgl.accessToken = "pk.eyJ1IjoidHRiaW50dCIsImEiOiJjbHBnb282amQwMDVjMmpyeHY5N2c1bXMyIn0.ti-gYOhpihy4YzAFbKuxZQ";

// Initialize the map
const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: [lng, lat],
    zoom: 18,
    projection: "globe",
    interactive: false
});

const el = document.createElement("div");
el.className = "default-marker";
if (sts == "Đã quy hoạch") {
    el.style.backgroundImage = 'url("/static/images/citizen/ads-blue.png")';
} else if (sts === "Chưa quy hoạch") {
    el.style.backgroundImage = 'url("/static/images/citizen/ads-red.png")';
}
el.style.backgroundSize = "cover";
el.style.width = "30px";
el.style.height = "30px";
new mapboxgl.Marker(el).setLngLat([Number(lng), Number(lat)]).addTo(map);
document.getElementById("form-citizen").addEventListener("submit", function (event) {
    event.preventDefault();
    let recaptchaResponse = grecaptcha.getResponse();
    let email = $("#email").val();
    let name = $("#fullname").val();
    let phone = $("#phone").val();
    if (!recaptchaResponse) {
        $("#notification-captcha").css("display", "block");
    } else {
        $("#notification-captcha").css("display", "none");
    }
    if (email == "") {
        $("#notification-email").css("display", "block");
    } else {
        $("#notification-email").css("display", "none");
    }
    if (name == "") {
        $("#notification-name").css("display", "block");
    } else {
        $("#notification-name").css("display", "none");
    }
    if (phone == "") {
        $("#notification-phone").css("display", "block");
    } else {
        if (phone.length > 10) {
            $("#notification-phone").css("display", "block");
            $("#notification-phone").text("Số điện thoại không hợp lệ");
        } else {
            $("#notification-phone").css("display", "none");
        }
    }
});
