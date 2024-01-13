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

    $('[id^="accept-"]').on('click', function(event) {
        event.preventDefault(); 

        let requestId = $(this).data('id');
        let adsPanelId = $(this).data('value');

        let row = $('#accept-' + requestId).closest('tr');
        let ads_location = row.find('td:eq(2)').text();
        let ads_panel_type = row.find('td:eq(3)').text();
        let size = row.find('td:eq(4)').text();
        let quantity = row.find('td:eq(5)').text();

        size = size.slice(0, -1);
        let split = size.split("m x ");

        const adsPanelNew = {
            ads_location: ads_location,
            ads_panel_type: ads_panel_type,
            width: split[0],
            height: split[1],
            quantity: quantity
        };

        handleAcceptClick(requestId, adsPanelId, adsPanelNew);
    }); 
    
    function handleAcceptClick(requestId, adsPanelId, adsPanelNew) {
        console.log("Accept button clicked for requestId: ", requestId);
        $.ajax({
            url: "ads-panel-modification-request/accept-request",
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ requestId: requestId, adsPanelId: adsPanelId, adsPanelNew: adsPanelNew }),
            success: function(response) {
                console.log('Request accepted successfully:', response);
                alert(response.message);
                window.location.reload();
            },
            error: function(error) {
                console.error('Error accepted request:', error);
                window.location.reload();
            }
        });
    }
});