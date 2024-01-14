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
  
$("#submitButton").on("click", function (event) {
    let isValid = true;
    console.log("Đã submit");
    const name = $("#txtName").val(); 
    if(name.length === 0){
        $('#txtName').addClass("is-invalid");
        $("#checkValidationEmptyName").show();
        $("#checkValidationName").hide();
        if(isValid) $('#txtName').focus();
        isValid = false;
    }
  
    if (!isValid) {
        event.preventDefault();
    } else {
        $('#frmAdd').on('submit', function (e) {
            e.preventDefault();
        
            const name = $('#txtName').val();
            const choice = $('#choice').val();
            console.log("choice: ", choice);

            let typeName = 'Loại vị trí';
            if(choice === 'ads-type'){
                typeName = 'Hình thức quảng cáo';
            }else if(choice === 'ads-panel-type'){
                typeName = 'Loại bảng quảng cáo';
            }else if(choice === 'report-type'){
                typeName = 'Hình thức báo cáo';
            }
            $.getJSON(`/department-officer/provided-info/is-available/${choice}?name=${name}`, function (data) {
                console.log("data: ", data);
                if(data === false){
                    alert(typeName + ' này đã tồn tại. Vui lòng đặt ' + typeName + ' khác');
                    $('#frmAdd').off('submit').submit();
                }else{
                    alert('Đã thêm ' + typeName + ' thành công');
                    $('#frmAdd').off('submit').submit();
                }
            });
        })
    }
});