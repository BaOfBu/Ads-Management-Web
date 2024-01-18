$('[id^="cancel-"]').on('click', function(event) {
    event.preventDefault(); 

    let adsPanelId = $(this).data('value');
    let requestId = $(this).data('id');

    handleCancelClick(adsPanelId, requestId);
});

function handleCancelClick(adsPanelId, requestId) {
    console.log("Cancel button clicked for requestId: ", requestId);
    $.ajax({
        url: "/district-officer/license-request/cancel-request", 
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