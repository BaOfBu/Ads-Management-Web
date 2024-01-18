$(function() {
    $('#txtStartDate').datetimepicker({
      timepicker: false,
      format: 'd/m/Y',
      mask: true,
      closeOnDateSelect: true,
      onChangeDateTime:function(dp,$input){
        console.log($input.val());
      }
      
    });

    $('#txtEndDate').datetimepicker({
        timepicker: false,
        format: 'd/m/Y',
        mask: true,
        closeOnDateSelect: true,
        onChangeDateTime:function(dp,$input){
          console.log($input.val());
        }
        
    });
});


$(document).ready(function () {
    $(".adsLocation .dropdown-menu .dropdown-item:first").addClass('active');
    $(".adsAdsPanelType .dropdown-menu .dropdown-item:first").addClass('active');

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
            url: '/ward-officer/license-request/upload-image',
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
    
    function checkEmail(email){
        let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    $("#txtEmailCompany").on("input", function () {
        if (checkEmail($('#txtEmailCompany').val())) {
            $(this).removeClass("is-invalid");
            $("#checkValidationEmptyEmail").hide();
        } else {
            $(this).addClass("is-invalid");
            $("#checkValidationEmptyEmail").show();
        }
    });
    
    function checkPhone(phone){
    let regex = /^(0[3-9])+([0-9]{8})$/;
    return regex.test(phone);
    }
    
    $("#txtPhoneCompany").on("input", function () {
        if (checkPhone($("#txtPhoneCompany").val())) {
            $(this).removeClass("is-invalid");
            $("#checkValidationEmptyPhone").hide();
        } else {
            $(this).addClass("is-invalid");
            $("#checkValidationEmptyPhone").show();
        }
    });
    
    $("#submitButton").on("click", async function(event) {
        let isValid = true; 
        event.preventDefault();
    
        const content = $('#txtContent').val();
        if (content.length === 0) {
            $('#txtContent').addClass("is-invalid");
            $("#checkValidationContent").show();
            $('#txtContent').focus();
            isValid = false;
        }else{
            $('#txtContent').removeClass("is-invalid");
            $("#checkValidationContent").hide();
            $('#txtContent').blur();
        }
    
        const img = $('#img').val();
        if (img.length === 0) {
            $('#img').addClass("is-invalid");
            $("#checkValidationImage").show();
            $('#img').focus();
            if(isValid) isValid = false;
        }else{
            $('#img').removeClass("is-invalid");
            $("#checkValidationImage").hide();
            $('#img').blur();
        }
    
        const nameCompany = $('#txtNameCompany').val();
        if (nameCompany.length === 0 || nameCompany.length > 50) {
            $('#txtNameCompany').addClass("is-invalid");
            $("#checkValidationEmptyName").show();
            if(isValid) $('#txtNameCompany').focus();
            isValid = false;
        }else{
            $('#txtNameCompany').removeClass("is-invalid");
            $("#checkValidationEmptyName").hide();
            if(isValid) $('#txtNameCompany').blur();
        }
      
        if (checkPhone($('#txtPhoneCompany').val()) === false) {
            $("#txtPhoneCompany").addClass("is-invalid");
            $("#checkValidationPhone").show();
            if(isValid) $('#txtPhoneCompany').focus();
            isValid = false;
        }else{
            $("#txtPhoneCompany").removeClass("is-invalid");
            $("#checkValidationPhone").hide();
            if(isValid) $('#txtPhoneCompany').blur();
        }
      
        if(checkEmail($('#txtEmailCompany').val()) === false){
            $('#txtEmailCompany').addClass('is-invalid');
            $('#checkValidationEmptyEmail').show();
            if(isValid) $('#txtEmailCompany').focus();
            isValid = false;
        }else{
            $('#txtEmailCompany').removeClass('is-invalid');
            $('#checkValidationEmptyEmail').hide();
            if(isValid) $('#txtEmailCompany').blur();
        }
    
        const locationCompany = $('#txtLocationCompany').val();
        if(locationCompany.length === 0){
            $('#txtLocationCompany').addClass('is-invalid');
            $('#checkValidationEmptyLocation').show();
            if(isValid) $('#txtLocationCompany').focus();
            isValid = false;
        }else{
            $('#txtLocationCompany').removeClass('is-invalid');
            $('#checkValidationEmptyLocation').hide();
            if(isValid) $('#txtLocationCompany').blur();
        }
    
        const startDate = $('#txtStartDate').val();
        if(startDate.length === 0 || startDate === "__/__/____"){
            $('#txtStartDate').addClass('is-invalid');
            $('#checkValidationStartDate').show();
            if(isValid) $('#txtStartDate').focus();
            isValid = false;
        }else{
            $('#txtStartDate').removeClass('is-invalid');
            $('#checkValidationStartDate').hide();
            if(isValid) $('#txtStartDate').blur();
        }
    
        const endDate = $('#txtEndDate').val();
        if(endDate.length === 0 || endDate === "__/__/____"){
            $('#txtEndDate').addClass('is-invalid');
            $('#checkValidationEndDate').show();
            if(isValid) $('#txtEndDate').focus();
            isValid = false;
        }else{
            $('#txtEndDate').removeClass('is-invalid');
            $('#checkValidationEndDate').hide();
            if(isValid) $('#txtEndDate').blur();
        }
    
        if(isValid){
            try {
                await uploadImage();
                // console.log("Upload thành công");
                $("#frmAdd").submit();
                alert("Đã tạo yêu cầu cấp phép quảng cáo thành công!!!");
            } catch (error) {
                console.log('Error during image upload:', error);
            }
        }else{
            event.preventDefault();
        } 
        
    });
    
    $('#cancel-request').on('click', function(event) {
        event.preventDefault(); 
    
        let adsPanelId = $('#adsPanelId').val();
        let requestId = $('#licenseRequestId').val();
    
        handleCancelClick(adsPanelId, requestId);
    });
    
    function handleCancelClick(adsPanelId, requestId) {
        console.log("Cancel button clicked for requestId: ", requestId);
        $.ajax({
            url: "/ward-officer/license-request/cancel-request", 
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({adsPanelId: adsPanelId, licenseRequestId: requestId }),
            success: function(response) {
                console.log('Request deleted successfully:', response);
                alert(response.message);
                window.location.reload();
            },
            error: function(error) {
                console.error('Error deleting request:', error);
                window.location.reload();
            }
        });
    }
});