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
    const choice = $('#choice').val();

    let typeName = 'loại vị trí';
    if(choice === 'ads-type'){
        typeName = 'hình thức quảng cáo';
    }else if(choice === 'ads-panel-type'){
        typeName = 'loại bảng quảng cáo';
    }else if(choice === 'report-type'){
        typeName = 'Hình thức báo cáo';
    }

    alert(`Bạn đã xóa ${typeName} này thành công!`);
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
        const choice = $('#choice').val();
        const name = $('#txtName').val();

        let typeName = 'Loại vị trí';
        if(choice === 'ads-type'){
            typeName = 'Hình thức quảng cáo';
        }else if(choice === 'ads-panel-type'){
            typeName = 'Loại bảng quảng cáo';
        }else if(choice === 'report-type'){
            typeName = 'Hình thức báo cáo';
        }

        $.getJSON(`/department-officer/provided-info/is-available/${choice}?name=${name}`, function (data) {
            if (data === false) {
                window.location.reload();
                $('#txtName').focus();
                alert(typeName + ' này đã tồn tại. Vui lòng đổi tên ' + typeName + ' khác!');
            }else{
                alert('Đã chỉnh sửa thông tin' + typeName + ' thành công!'); 
                $("#action").val("patch");
            }
        });
    }
});

$("#frmEdit").submit(function(event) {
    let action = $("#action").val();
    // const districtId = $('#selectedDistrict').val();

    if(action === "del" || action === "patch"){
        console.log("Đã valid");
        let formData = $(this).serialize();
        console.log(formData);
        const choice = $('#choice').val();
        $.ajax({
            type: "POST",
            url: "/department-officer/provided-info/" + $("#action").val() + '/' + choice,
            data: formData,
            success: function(response) {
                window.location.href = `/department-officer/provided-info/${choice}`;
            },
            error: function(error) {
                alert("Xảy ra vấn đề khi nộp form");
                window.location.href = `/department-officer/provided-info/${choice}`;
            }
        });
    }
    
});