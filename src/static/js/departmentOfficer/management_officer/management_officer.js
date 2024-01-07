$("#txtUsername").on("input", function () {
    if (checkUsername()) {
        $(this).removeClass("is-invalid");
        $("#checkValidationUsername").hide();
    } else {
        $(this).addClass("is-invalid");
        $("#checkValidationUsername").show();
    }
});

function checkUsername() {
    let username = $("#txtUsername").val();

    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,50}$/;
    return regex.test(username);
}

$("#txtPassword").on("input", function () {
    $("#txtConfirm").val("");
    if (checkPassword()) {
        $(this).removeClass("is-invalid");
        $("#checkValidationPassword").hide();
    } else {
        $(this).addClass("is-invalid");
        $("#checkValidationPassword").show();
    }
});

function checkPassword() {
    let password = $("#txtPassword").val();

    let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,50}$/;
    return regex.test(password);
}

$("#txtConfirm").on("input", function () {
    if (checkConfirmPassword()) {
        $(this).removeClass("is-invalid");
        $("#checkValidationConfirmPassword").hide();
    } else {
        $(this).addClass("is-invalid");
        $("#checkValidationConfirmPassword").show();
    }
});

function checkConfirmPassword() {
    let password = $("#txtPassword").val();
    let confirm_password = $("#txtConfirm").val();

    return confirm_password.length > 0 && password == confirm_password;
}

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

$("#dropdownWard").on("click", function () {
    if($("#selectedWard").val() == ""){
        $("#dropdownWard").addClass("is-invalid");
        $("#wardError").show();
    }else{
        $("#dropdownWard").removeClass("is-invalid");
        $("#wardError").hide();
    }
});

$(".ward ul.dropdown-menu").on("click", ".dropdown-item", function (event) {
    event.preventDefault();
    console.log("Đã vô");
    $("#dropdownDistrict").removeClass("is-invalid");
    $("#districtError").hide();
    let selectedValue = $(this).data("value");
    console.log("selectedWard: ", selectedValue);
    $("#selectedWard").val(selectedValue);
    $("#dropdownWard").text(selectedValue);
    $("#dropdownWard").removeClass("is-invalid");
    $("#wardError").hide();
});

$("#dropdownDistrict").on("click", function () {
    if($("#selectedDistrict").val() == ""){
        $("#dropdownDistrict").addClass("is-invalid");
        $("#districtError").show();
    }else{
        $("#dropdownDistrict").removeClass("is-invalid");
        $("#districtError").hide();
    }
});

$(".district .dropdown-menu .dropdown-item").on("click", function (event) {
    event.preventDefault();
    let selectedValue = $(this).data("value");
    $("#selectedDistrict").val(selectedValue);
    $("#dropdownDistrict").text(selectedValue);

    console.log("selectedDistrict: ", selectedValue);
    $('.ward ul.dropdown-menu').empty();
    $.getJSON(`/department-officer/management-officer/list-ward?district=${selectedValue}`, function (data) {
        if(data != false){
            for (let p of data) {
                let newItem = '<li><a class="dropdown-item" data-value="' + p.name + '">' + p.name + '</a></li>';
                console.log(newItem);
                $(".ward ul.dropdown-menu").append(newItem);
            }
        }else{
            $("#selectedWard").val("");
            $("#dropdownWard").text("Phường");
        }  
    });

    $("#dropdownDistrict").removeClass("is-invalid");
    $("#districtError").hide();
});

$("#submitButton").on("click", function (event) {
    let isValid = true;
    if(checkUsername() === false){
        $('#txtUsername').addClass("is-invalid");
        $("#checkValidationUsername").show();
        $('#txtUsername').focus();
        isValid = false;
    }
    if(checkPassword() === false){
        $('#txtPassword').addClass("is-invalid");
        $("#checkValidationPassword").show();
        if(isValid) $('#txtPassword').focus();
        isValid = false;
    }
    if(checkConfirmPassword() === false){
        $('#txtConfirm').addClass("is-invalid");
        $("#checkValidationConfirmPassword").show();
        if(isValid) $('#txtConfirm').focus();
        isValid = false;
    }
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

    if($("#selectedDistrict").val() == ""){
        $("#dropdownDistrict").addClass("is-invalid");
        $("#districtError").show();
        if(isValid) $("#dropdownDistrict").focus(); 
        isValid = false;
    }
    
    if($("#selectedWard").val() == ""){
        $("#dropdownWard").addClass("is-invalid");
        $("#wardError").show();
        if(isValid) $("#dropdownWard").focus();
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
    } else {
        $('#frmRegister').on('submit', function (e) {
            e.preventDefault();
        
            const username = $('#txtUsername').val();
        
            $.getJSON(`/department-officer/management-officer/is-available?username=${username}`, function (data) {
              if (data === false) {
                alert('Tài khoản đã tồn tại. Vui lòng chọn tên đăng nhập khác!');
                $('#frmRegister').off('submit').submit();
              } else {
                alert('Đã tạo tài khoản thành công!');
                $('#frmRegister').off('submit').submit();
              }
            });
        })
    }
});