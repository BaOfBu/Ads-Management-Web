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

$("#submitButton").on("click", async function(event) {
    let isValid = true; 
    event.preventDefault();
    // if (isEmpty($('#dropdownAdsLocation').val())) {
    //   $('#dropdownAdsLocation').addClass("is-invalid");
    //   $("#adsLocationError").show();
    //   $('#dropdownAdsLocation').focus();
    //   isValid = false;
    //   return;
    // }
  
    // if (isEmpty($("#dropdownAdsPanelType").val())) {
    //   $("#dropdownAdsPanelType").addClass("is-invalid");
    //   $("#adsPanelTypeError").show();
    //   if(isValid) $('#dropdownAdsPanelType').focus();
    //   isValid = false;
    //   return;
    // }
  
    // if(isEmpty($('#txtWidth').val())){
    //     $('#txtWidth').addClass('is-invalid');
    //     $('#checkValidationEmptyWidth').show();
    //     if(isValid) $('#txtWidth').focus();
    //     isValid = false;
    // }

    // if(isEmpty($('#txtHeight').val())){
    //     $('#txtHeight').addClass('is-invalid');
    //     $('#checkValidationEmptyHeight').show();
    //     if(isValid) $('#txtHeight').focus();
    //     isValid = false;
    // }

    if(isValid){
        try {
            // await uploadImage();
            // console.log("Upload thành công");
            $("#frmAdd").submit();
            alert("Đã thêm bảng quảng cáo thành công!!!");
        } catch (error) {
            // console.error('Error during image upload:', error);
        }
    }else{
        event.preventDefault();
    } 
    
  });