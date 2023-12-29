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
    alert("Bạn đã xóa phường này thành công!");
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
        const districtId = $('#selectedDistrict').val();
        const name = $('#txtName').val();

        $.getJSON(`/department-officer/ward/is-available?districtId=${districtId}&name=${name}`, function (data) {
            if (data === false) {
                window.location.reload();
                $('#txtName').focus();
                alert('Phường này đã tồn tại. Vui lòng đổi tên phường khác!');
            }else{
                alert('Đã chỉnh sửa thông tin phường thành công!'); 
                $("#action").val("patch");
            }
        });
    }
});

$("#frmEdit").submit(function(event) {
    let action = $("#action").val();
    const districtId = $('#selectedDistrict').val();

    if(action === "del" || action === "patch"){
        console.log("Đã valid");
        let formData = $(this).serialize();
        console.log(formData);
        $.ajax({
            type: "POST",
            url: "/department-officer/ward/" + $("#action").val(),
            data: formData,
            success: function(response) {
                window.location.href = `/department-officer/ward?districtId=${districtId}`;
            },
            error: function(error) {
                alert("Xảy ra vấn đề khi nộp form");
                window.location.href = `/department-officer/ward?districtId=${districtId}`;
            }
        });
    }
    
});
