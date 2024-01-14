$('#fuMain').fileinput({
    dropZoneEnabled: false,
    maxFileCount: 1,
    allowedFileExtensions: ['jpg', 'png', 'gif'],
    language: 'vi',
});

async function uploadAvatar() {
    const fileInput = $("#fuMain")[0].files[0];
    if (!fileInput) {
      console.error('No file selected.');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', fileInput);
  
    return new Promise((resolve, reject) => {
      $.ajax({
        url: '/ward-officer/ads/upload-avatar',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            console.log(data);
            resolve(data);
        },
        error: function(error) {
            console.error('Error:', error);
            reject(error);
        }
      });
    });
  }