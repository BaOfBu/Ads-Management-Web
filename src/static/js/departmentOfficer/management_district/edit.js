$("#txtName").on("input", function () {
    const name = $("#txtName").val(); 
    if (name.length > 50) {
        $(this).addClass("is-invalid");
        $("#checkValidationName").show();
        $("#checkValidationEmptyName").hide();
    } else {
        $(this).removeClass("is-invalid");
        $("#checkValidationName").hide();
        $("#checkValidationEmptyName").hide();
    }
});

$("#btnDelete").on("click", function() {
    $("#action").val("del");
    alert("Bạn đã xóa quận này thành công!");
});

$("#btnSubmit").on("click", function() {
    const name = $("#txtName").val(); 
    if(name.length === 0){
        $('#txtName').addClass("is-invalid");
        $("#checkValidationEmptyName").show();
        $("#checkValidationName").hide();
        $('#txtName').focus();
        $("#action").val("noAction");
    }else if(name.length > 50){
        $('#txtName').addClass("is-invalid");
        $("#checkValidationEmptyName").hide();
        $("#checkValidationName").show();
        $('#txtName').focus();
        $("#action").val("noAction");
    }else{
        const name = $('#txtName').val();
        
        $.getJSON(`/department-officer/district/is-available?name=${name}`, function (data) {
            if (data === false) {
                window.location.reload();
                $('#txtName').focus();
                alert('Quận này đã tồn tại. Vui lòng đổi tên quận khác!');
            }else{
                alert('Đã chỉnh sửa thông tin quận thành công!'); 
                $("#action").val("patch");
            }
        });
    }
});

$("#frmEdit").submit(function(event) {
    let action = $("#action").val();

    if(action === "del" || action === "patch"){
        console.log("Đã valid");
        let formData = $(this).serialize();
        console.log(formData);
        $.ajax({
            type: "POST",
            url: "/department-officer/district/" + $("#action").val(),
            data: formData,
            success: function(response) {
                window.location.href = "/department-officer/district";
            },
            error: function(error) {
                alert("Xảy ra vấn đề khi nộp form");
                window.location.href = "/department-officer/district";
            }
        });
    }
    
});
