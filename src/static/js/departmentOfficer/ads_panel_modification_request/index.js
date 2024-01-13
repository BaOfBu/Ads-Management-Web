$(document).ready(function() {
    $('[id^="cancel-"]').on('click', function(event) {
        event.preventDefault(); 

        let requestId = $(this).data('id');

        handleCancelClick(requestId);
    });

    function handleCancelClick(requestId) {
        console.log("Cancel button clicked for requestId: ", requestId);
        $.ajax({
            url: "ads-panel-modification-request/cancel-request", // Replace with your server endpoint
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ requestId: requestId }),
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