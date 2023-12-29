$(document).ready(function () {
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
});

$(document).ready(function () {
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
});

$(document).ready(function () {
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

        return password == confirm_password;
    }
});

$(document).ready(function () {
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

        return password == confirm_password;
    }
});

$(document).ready(function () {
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

        return name.length <= 100;
    }
});

$(document).ready(function () {
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
});

$('#txtDoB').datetimepicker({
    timepicker: false,
    format: 'd/m/Y',
    mask: true
});

$(document).ready(function () {
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
});

$(document).ready(function () {
    $("#dropdownWard").on("click", function () {
        if($("#selectedWard").val() == ""){
            $(this).addClass("is-invalid");
            $("#dropdownWard").addClass("is-invalid");
            $("#wardError").show();
        }else{
            $(this).removeClass("is-invalid");
            $("#dropdownWard").removeClass("is-invalid");
            $("#wardError").hide();
        }
    });

    $(".ward .dropdown-menu .dropdown-item").on("click", function () {
        var selectedValue = $(this).data("value");
        $("#selectedWard").val(selectedValue);
        $("#dropdownWard").text(selectedValue);
        $("#dropdownWard").removeClass("is-invalid");
        $("#wardError").hide();
    });
});

$(document).ready(function () {
    $("#dropdownDistrict").on("click", function () {
        if($("#selectedDistrict").val() == ""){
            $("#dropdownDistrict").addClass("is-invalid");
            $("#districtError").show();
        }else{
            $("#dropdownDistrict").removeClass("is-invalid");
            $("#districtError").hide();
        }
    });

    $(".district .dropdown-menu .dropdown-item").on("click", function () {
        var selectedValue = $(this).data("value");
        $("#selectedDistrict").val(selectedValue);
        $("#dropdownDistrict").text(selectedValue);
        $("#dropdownDistrict").removeClass("is-invalid");
        $("#districtError").hide();
    });
});

$("#submitButton").on("click", function (event) {
    var selectedValue = $("#selectedWard").val();

    if (!selectedValue) {
        event.preventDefault();
    } else {
        $('#frmRegister').on('submit', function (e) {
            e.preventDefault();
            alert("Đã tạo tài khoản thành công!");
        });
    }
});