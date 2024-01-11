function ValidatePassword() {
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    if(password == "" || confirmPassword == ""){
        alert("Please enter password and confirm password.");
        return false;
    }
    if (password != confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }
    return true;
}

$('#change-password-form').submit(function (e) {
    if (!ValidatePassword()) {
        e.preventDefault();
    }
});