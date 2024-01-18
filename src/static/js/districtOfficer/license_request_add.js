$(document).ready(function () {
    $(".adsLocation .dropdown-menu .dropdown-item:first").addClass('active');
    $(".adsAdsPanelType .dropdown-menu .dropdown-item:first").addClass('active');
});

$('#img').fileinput({
    dropZoneEnabled: false,
    maxFileCount: 1,
    allowedFileExtensions: ['jpg', 'png', 'gif'],
    language: 'vi',
});

async function uploadImage() {
    let fileInput = $("#img")[0].files[0];
    if (!fileInput) {
      console.error('No file selected.');
      return;
    }

    const filename = $('#imgId').val() + '.' + fileInput.name.split(".").pop();

    const newFile = new File([fileInput], filename, { type: fileInput.type, lastModified: fileInput.lastModified });

    const formData = new FormData();
    formData.append('image', newFile);
    formData.append('imgId', $('#imgId').val());
  
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/district-officer/license-request/upload-image',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            console.log("data: ", data);
            resolve(data);
        },
        error: function(error) {
            console.error('Error:', error);
            reject(error);
        }
      });
    });
}


$('.adsLocation .dropdown-menu .dropdown-item').click(function () {
    $('.dropdown-item').removeClass('active');

    $(this).addClass('active');

    $('#dropdownAdsLocation').text($(this).text());

    $('#selectedAdsLocation').val($(this).data('id'));

    console.log("Đã click vô adsLocation: ", $('#selectedAdsLocation').val());
    $.ajax({
        url: '/district-officer/license-request/get-ads-panel-type',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ adsLocationId: $('#selectedAdsLocation').val() }),
        success: function(response) {
            populateAdsPanelTypeDropdown(response.adsPanelTypes);
        },
        error: function(error) {
            console.error('Error fetching wards:', error);
        }
    });
});

$('.adsAdsPanelType .dropdown-menu .dropdown-item').click(function () {
    $('.dropdown-item').removeClass('active');

    $(this).addClass('active');

    $('#dropdownAdsPanelType').text($(this).text());

    $('#selectedAdsPanelType').val($(this).data('id'));
    $('#selectedAdsPanel').val($(this).data('adsPanelId'));
});

function populateAdsPanelTypeDropdown(adsPanelType) {
    let dropdownAdsPanelType = $('.adsAdsPanelType ul.dropdown-menu');

    console.log("panel: ", adsPanelType);
    dropdownAdsPanelType.empty();
    if(adsPanelType.length === 0){
        $('#dropdownAdsPanelType').text("");
    }else{
        console.log("dropdownAdsPanelType: ", dropdownAdsPanelType);
        for (let i = 0; i < adsPanelType.length; i++) {
            let type = adsPanelType[i];
            dropdownAdsPanelType.append('<li><a class="dropdown-item" data-value="' + type.ads_panel_type_name + '" data-id="' + type.ads_panel_type_id + '">' + type.ads_panel_type_name + '</a></li>');
        }
        $('#dropdownAdsPanelType').text(adsPanelType[0].ads_panel_type_name);
        $('#selectedAdsPanelType').val(adsPanelType[0].ads_panel_type_id);
        $('#selectedAdsPanel').val(adsPanelType[0].adsPanelId);
        $(".adsAdsPanelType .dropdown-menu .dropdown-item:first").addClass('active');
    }
}

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
            await uploadImage();
            // console.log("Upload thành công");
            $("#frmAdd").submit();
            alert("Đã tạo yêu cầu cấp phép quảng cáo thành công!!!");
        } catch (error) {
            // console.error('Error during image upload:', error);
        }
    }else{
        event.preventDefault();
    } 
    
});