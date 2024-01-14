$('#formReport').on('submit', function (e) {
    e.preventDefault();
    var data = $(this).serialize();
    const flag = $('#flag').val();
    const status = $('#txtStatus').val();
    const handlingContent = $('#txthandlingProcedureInfor').val();
    if(flag == "true"){
        if(status == "Đang xử lí" || handlingContent == ""){
            alert("Bạn chưa xử lí báo cáo này");
            return;
        }
    }
    $.ajax({
        url: '/ward-officer/report/updateStatus',
        type: 'POST',
        data: data,
        success: function (data) {
            $('#reportDetail').html(data);
            alert("Cập nhật thành công");
            window.location.href = "/ward-officer/report";
        }
    });
});