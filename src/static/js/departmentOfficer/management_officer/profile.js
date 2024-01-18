$("#txtUsername").on("input", function () {
    if (checkUsername()) {
        $(this).removeClass("is-invalid");
        $("#checkValidationUsername").hide();
    } else {
        $(this).addClass("is-invalid");
        $("#checkValidationUsername").show();
    }
});

$("#txtName").on("input", function () {
    if (checkName()) {
        $(this).removeClass("is-invalid");
        $("#checkValidationName").hide();
    } else {
        $(this).addClass("is-invalid");
        $("#checkValidationName").show();
    }
});

function checkName() {
    let name = $("#txtName").val();

    return name.length > 0 && name.length <= 100;
}

$("#txtEmail").on("input", function () {
    if (checkEmail()) {
        $(this).removeClass("is-invalid");
        $("#checkValidationEmail").hide();
    } else {
        $(this).addClass("is-invalid");
        $("#checkValidationEmail").show();
    }
});

function checkEmail() {
    let email = $("#txtEmail").val();

    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length <= 100;
}

$('#txtDoB').datetimepicker({
    timepicker: false,
    format: 'd/m/Y',
    mask: true
});

$("#txtDoB").on("input", function () {
    if ($("#txtDoB").val().trim() === "" || $("#txtDoB").val() === "__/__/____") {
        $(this).addClass("is-invalid");
        $("#checkValidationPhone").show();
    } else {
        $(this).removeClass("is-invalid");
        $("#checkValidationPhone").hide();
    }
});

$("#txtPhone").on("input", function () {
    if (checkPhone()) {
        $(this).removeClass("is-invalid");
        $("#checkValidationPhone").hide();
    } else {
        $(this).addClass("is-invalid");
        $("#checkValidationPhone").show();
    }
});

function checkPhone() {
    let phone = $("#txtPhone").val();

    let regex = /^(0[3-9])+([0-9]{8})$/;
    return regex.test(phone);
}

$("#submitButton").on("click", function (event) {
    let isValid = true;

    if(checkName() === false){
        $('#txtName').addClass("is-invalid");
        $("#checkValidationName").show();
        if(isValid) $('#txtName').focus();
        isValid = false;
    }
    if(checkEmail() === false){
        $('#txtEmail').addClass("is-invalid");
        $("#checkValidationEmail").show();
        if(isValid) $('#txtEmail').focus();
        isValid = false;
    }
    if(!$("#txtDoB").val().trim() ||  $("#txtDoB").val() === "__/__/____"){
        $('txtDoB').addClass("is-invalid");
        $("#checkValidationDoB").show();
        if(isValid) $("#txtDoB").focus();
        isValid = false;
    }
    if(checkPhone() === false){
        $('#txtPhone').addClass("is-invalid");
        $("#checkValidationPhone").show();
        if(isValid) $('#txtPhone').focus();
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
    } else {
        $('#frmUpdate').submit();
        alert('Cán bộ đã cập nhật thông tin cá nhân thành công!');
    }
});