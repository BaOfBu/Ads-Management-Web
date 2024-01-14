// $('#img').fileinput({
//     dropZoneEnabled: false,
//     maxFileCount: 1,
//     allowedFileExtensions: ['jpg', 'png', 'gif'],
//     language: 'vi',
// });

// async function uploadImage() {
//     let fileInput = $("#img")[0].files[0];
//     if (!fileInput) {
//       console.error('No file selected.');
//       return;
//     }
//     console.log("origin: ", fileInput.name);
//     const filename = $('#imgId').val() + '.' + fileInput.name.split(".").pop();

//     const newFile = new File([fileInput], filename, { type: fileInput.type, lastModified: fileInput.lastModified });

//     const formData = new FormData();
//     formData.append('image', newFile);
//     formData.append('imgId', $('#imgId').val());
  
//     return new Promise((resolve, reject) => {
//       $.ajax({
//         url: '/department-officer/ads-panel/upload-image',
//         type: 'POST',
//         data: formData,
//         processData: false,
//         contentType: false,
//         success: function(data) {
//             console.log("data: ", data);
//             resolve(data);
//         },
//         error: function(error) {
//             console.error('Error:', error);
//             reject(error);
//         }
//       });
//     });
// }

function isEmpty(field){
    return field.length === 0;
}

$('.adsLocation .dropdown-menu .dropdown-item').click(function () {
    $('.dropdown-item').removeClass('active');

    $(this).addClass('active');

    $('#dropdownAdsLocation').text($(this).text());

    $('#selectedAdsLocation').val($(this).data('id'));
});

$('.adsAdsPanelType .dropdown-menu .dropdown-item').click(function () {
    $('.dropdown-item').removeClass('active');

    $(this).addClass('active');

    $('#dropdownAdsPanelType').text($(this).text());

    $('#selectedAdsPanelType').val($(this).data('id'));
});

$("#btnDelete").on("click", function() {
    alert(`Bạn đã xóa bảng quảng cáo này thành công!`);
    $("#action").val("del");
    $("#frmEdit").submit();
});

$("#btnSubmit").on("click", async function() {
    try {
        // await uploadImage();
        $("#action").val("patch");
        $("#frmEdit").submit();
        alert('Đã chỉnh sửa thông tin bảng quảng cáo này thành công!');
    } catch (error) {
        console.error('Lỗi trong quá trình tải ảnh lên:', error);
        alert('Có lỗi trong quá trình tải ảnh lên. Vui lòng thử lại.');
    }
});