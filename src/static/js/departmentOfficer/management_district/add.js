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
        
            $.getJSON(`/department-officer/district/is-available?name=${name}`, function (data) {
              if (data === false) {
                alert('Quận này đã tồn tại. Vui lòng đặt tên quận khác!');
                $('#frmAdd').off('submit').submit();
              } else {
                alert('Đã thêm một quận thành công!');
                $('#frmAdd').off('submit').submit();
              }
            });
        })
    }
});