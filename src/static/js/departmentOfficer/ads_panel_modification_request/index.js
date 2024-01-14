$(document).ready(function() {
    $('.districts ul.dropdown-menu').on('click', '.dropdown-item', function() {
        console.log("Đã click");
        let selectedDistrictId = $(this).data('id');
        let selectedDistrictName = $(this).data('value');
        console.log("selected: ", selectedDistrictName);

        $('#dropdownDistrict').text('Quận ' + selectedDistrictName);
        activateDistrict(selectedDistrictId);
        $.ajax({
            url: 'ads-panel-modification-request/get-ward-by-district',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ districtId: selectedDistrictId }),
            success: function(response) {
                populateWardsDropdown(response.wards);
            },
            error: function(error) {
                console.error('Error fetching wards:', error);
            }
        });
    });

    function activateDistrict(selectedDistrictId) {
        $('.districts ul.dropdown-menu .dropdown-item').removeClass('active');

        $('.districts ul.dropdown-menu .dropdown-item[data-id="' + selectedDistrictId + '"]').addClass('active');
    }

    function activateWard(selectedWardId) {
        $('.wards ul.dropdown-menu .dropdown-item').removeClass('active');

        $('.wards ul.dropdown-menu .dropdown-item[data-id="' + selectedWardId + '"]').addClass('active');
    }

    function populateWardsDropdown(wards) {
        let dropdownWard = $('.wards ul.dropdown-menu');

        dropdownWard.empty();

        console.log("wards: ", wards);
        for (let i = 0; i < wards.length; i++) {
            let ward = wards[i];
            dropdownWard.append('<li><a class="dropdown-item" data-value="' + ward.name + '" data-id="' + ward.wardId + '">Phường ' + ward.name + '</a></li>');
        }
    }

    $('.wards ul.dropdown-menu').on('click', '.dropdown-item', function() {
        let selectedWardId = $(this).data('id');
        let selectedWardName = $(this).data('value');
        $('#dropdownWard').text('Phường ' + selectedWardName);
        activateWard(selectedWardId);
        $.ajax({
            url: 'ads-panel-modification-request/get-request-by-ward',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ wardId: selectedWardId }),
            success: function(response) {
                $('tbody').empty();
                displayListRequestByWard(response.request);
                $('#dateSpan').text(response.date);
            },
            error: function(error) {
                console.error('Error fetching wards:', error);
            }
        });
    });

    function displayListRequestByWard(request) {
        if(request.length === 0){
            let newDiv = '<div class="card-body">Không có dữ liệu</div>';
            // $('table').remove();
            $('.list').children().eq(1).remove();
            $('.list').children().last().before(newDiv);
        }else{
            $('table').remove();
            console.log("Có request");
            if ($('.list').children().length === 3) {
                $('.list').children().eq(1).remove();
                console.log("Đã xóa");
            }
            let table = '<table class="table table-hover">'+
            '<thead>'+
                '<tr>'
                    +'<th scope="col" style="width: 2%">#</th>'
                    +'<th scope="col" style="width: 10%">Thời điểm xin</th>'
                    +'<th scope="col" style="width: 12%">Lí do</th>'
                    +'<th scope="col" style="width: 17%">Địa chỉ</th>'
                    +'<th scope="col" style="width: 9%">Khu vực</th>'
                    +'<th scope="col" style="width: 13%">Loại bảng</th>'
                    +'<th scope="col" style="width: 10%">Kích thước</th>'
                    +'<th scope="col" style="width: 7%">Số lượng</th>'
                    +'<th scope="col" style="width: 10%">Trạng thái</th>'
                    +'<th scope="col" style="width: 10%">Hành động</th>'
                +'</tr>'+
            '</thead>'+
            '<tbody>'+
            '</tbody>'
            +'</table>';
            $('.list').children().last().before(table);
            for(let i = 0; i < request.length; i++){
                let newRow = '<tr>' +
                '<td>' + request[i].stt + '</td>' +
                '<td>' + request[i].requestTime + '</td>' +
                '<td>' + request[i].requestReason + '</td>' +
                '<td>' + request[i].ads_location_name + '</td>' +
                '<td>Phường ' + request[i].ward_name + ' - Quận ' + request[i].district_name + '</td>' +
                '<td>' + request[i].ads_panel_type_name + '</td>' +
                '<td>' + request[i].width + 'm x ' + request[i].height + 'm</td>' +
                '<td>' + request[i].quantity + '</td>' +
                '<td>' + request[i].status + '</td>' +
                '<td class="d-flex">' +
                '<div class="d-flex justify-content-center" style="margin-right: 10px;">' +
                `<a class="btn btn-sm btn-outline-info" data-id="${request[i].requestId}" id="cancel-${request[i].requestId}" role="button">` +
                '<img src="/static/images/departmentOfficer/icon-cancel.png" width="24" height="24" alt="cancel this request">' +
                '</a>' +
                '</div>' +
                '<div class="d-flex justify-content-center">' +
                `<a class="btn btn-sm btn-outline-info" data-id="${request[i].requestId}" data-value="${request[i].adsPanelId}" id="accept-${request[i].requestId}" role="button">` +
                '<img src="/static/images/departmentOfficer/icon-accept.png" width="24" height="24" alt="accept this request">' +
                '</a>' +
                '</div>' +
                '</td>' +
                '</tr>';
                $('tbody').append(newRow);
            }
        }
    }

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