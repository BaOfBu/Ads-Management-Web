$(document).ready(function() {
    activateDistrict($('#selectedDistrictId').val());
    activateWard($('#selectedWardId').val());

    $('.districts ul.dropdown-menu').on('click', '.dropdown-item', function() {
        console.log("Đã click");
        let selectedDistrictId = $(this).data('id');
        let selectedDistrictName = $(this).data('value');
        $('#selectedDistrictId').val(selectedDistrictId);
        console.log("selected: ", selectedDistrictName);

        if(selectedDistrictId === -1) {
            $('#dropdownDistrict').text(selectedDistrictName);
            $('#dropdownWard').text('Tất cả phường');
            const emptyArray = [];
            populateWardsDropdown(emptyArray);
        }else{
            $('#dropdownDistrict').text('Quận ' + selectedDistrictName);   
            $('#dropdownWard').text('Tất cả phường');
            $.ajax({
                url: 'ads-location-modification-request/get-ward-by-district',
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
        }
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
        const districtId = $('#selectedDistrictId').val();

        let dropdownWard = $('.wards ul.dropdown-menu');
    
        dropdownWard.empty();
    
        console.log("wards: ", wards);
        dropdownWard.append(`<li><a href="ads-location-modification-requestdistrictId=${districtId}&wardId=-1&page=1" class="dropdown-item active" data-value="Tất cả phường" data-id="-1">Tất cả phường</a></li>`);
        for (let i = 0; i < wards.length; i++) {
            let ward = wards[i];
            dropdownWard.append(`<li><a href="ads-location-modification-request?districtId=${districtId}&wardId=${ward.wardId}&page=1" class="dropdown-item" data-value="` + ward.name + '" data-id="' + ward.wardId + '">Phường ' + ward.name + '</a></li>');
        }
    }

    // $('.wards ul.dropdown-menu').on('click', '.dropdown-item', function() {
    //     let selectedWardId = $(this).data('id');
    //     let selectedWardName = $(this).data('value');
    //     $('#dropdownWard').text('Phường ' + selectedWardName);
    //     activateWard(selectedWardId);
    //     $.ajax({
    //         url: 'ads-location-modification-request/get-request-by-ward',
    //         method: 'POST',
    //         contentType: 'application/json',
    //         data: JSON.stringify({ wardId: selectedWardId }),
    //         success: function(response) {
    //             $('tbody').empty();
    //             displayListRequestByWard(response.request);
    //             $('#dateSpan').text(response.date);
    //         },
    //         error: function(error) {
    //             console.error('Error fetching wards:', error);
    //         }
    //     });
    // });

    // function displayListRequestByWard(request) {
    //     if(request.length === 0){
    //         let newDiv = '<div class="card-body">Không có dữ liệu</div>';
    //         $('.list').children().eq(1).remove();
    //         $('.list').children().last().before(newDiv);
    //     }else{
    //         $('table').remove();
    //         console.log("Có request");
    //         if ($('.list').children().length === 3) {
    //             $('.list').children().eq(1).remove();
    //             console.log("Đã xóa");
    //         }
    //         let table = '<table class="table table-hover">'+
    //         '<thead>'+
    //             '<tr>'+
    //             '<th scope="col" style="width: 2%">#</th>'+
    //             '<th scope="col" style="width: 10%">Thời điểm xin</th>'+
    //             '<th scope="col" style="width: 15%">Lí do</th>'+
    //             '<th scope="col" style="width: 18%">Địa chỉ</th>'+
    //             '<th scope="col" style="width: 9%">Khu vực</th>'+
    //             '<th scope="col" style="width: 8%">Loại vị trí</th>'+
    //             '<th scope="col" style="width: 11%">Hình thức QC</th>'+
    //             '<th scope="col" style="width: 8%">Hình ảnh</th>'+
    //             '<th scope="col" style="width: 9%">Trạng thái</th>'+
    //             '<th scope="col" style="width: 10%">Hành động</th>'
    //             +'</tr>'+
    //         '</thead>'+
    //         '<tbody>'+
    //         '</tbody>'
    //         +'</table>';
    //         $('.list').children().last().before(table);
    //         for(let i = 0; i < request.length; i++){
    //             let newRow = '<tr>' +
    //             '<td>' + request[i].stt + '</td>' +
    //             '<td>' + request[i].requestTime + '</td>' +
    //             '<td>' + request[i].requestReason + '</td>' +
    //             '<td>' + request[i].ads_location_name + '</td>' +
    //             '<td>Phường ' + request[i].ward_name + ' - Quận ' + request[i].district_name + '</td>' +
    //             '<td>' + request[i].ads_location_type_name + '</td>' +
    //             '<td>' + request[i].ads_type_name + '</td>' +
    //             '<td>' + request[i].img_link + '</td>' +
    //             '<td>' + request[i].status + '</td>' +
    //             '<td class="d-flex">' +
    //             '<div class="d-flex justify-content-center" style="margin-right: 10px;">' +
    //             `<a class="btn btn-sm btn-outline-info" data-id="${request[i].requestId}" id="cancel-${request[i].requestId}" role="button">` +
    //             '<img src="/static/images/departmentOfficer/icon-cancel.png" width="24" height="24" alt="cancel this request">' +
    //             '</a>' +
    //             '</div>' +
    //             '<div class="d-flex justify-content-center">' +
    //             `<a class="btn btn-sm btn-outline-info" data-id="${request[i].requestId}" data-value="${request[i].adsLocationId}" id="accept-${request[i].requestId}" role="button">` +
    //             '<img src="/static/images/departmentOfficer/icon-accept.png" width="24" height="24" alt="accept this request">' +
    //             '</a>' +
    //             '</div>' +
    //             '</td>' +
    //             '</tr>';
    //             $('tbody').append(newRow);
    //         }
    //     }
    // }

    $('[id^="cancel-"]').on('click', function(event) {
        event.preventDefault(); 

        let requestId = $(this).data('id');

        handleCancelClick(requestId);
    });

    function handleCancelClick(requestId) {
        console.log("Cancel button clicked for requestId: ", requestId);
        $.ajax({
            url: "ads-location-modification-request/cancel-request",
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
        let adsLocationId = $(this).data('value');

        let row = $('#accept-' + requestId).closest('tr');
        let ads_location_type = row.find('td:eq(4)').text();
        let ads_type = row.find('td:eq(5)').text();
        let img_link = row.find('td:eq(6)').text();

        const adsLocationNew = {
            ads_location_type: ads_location_type,
            ads_type: ads_type,
            img_link: img_link
        };

        handleAcceptClick(requestId, adsLocationId, adsLocationNew);
    }); 
    
    function handleAcceptClick(requestId, adsLocationId, adsLocationNew) {
        console.log("Accept button clicked for requestId: ", requestId);
        $.ajax({
            url: "ads-location-modification-request/accept-request",
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ requestId: requestId, adsLocationId: adsLocationId, adsLocationNew: adsLocationNew }),
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

    $('#previousPage').on('click', function() {
        let urlParams = new URLSearchParams(window.location.search);
        let page = urlParams.get('page') || 1;
        let currentPage = Number(page);
        page = currentPage - 1;
        urlParams.set("page", page);
        $(this).attr('href', "?" + urlParams.toString());
    });
    
    $('#nextPage').on('click', function() {
        console.log("Đã next page");
        let urlParams = new URLSearchParams(window.location.search);
        let page = urlParams.get('page') || 1;
        let currentPage = Number(page);
        page = currentPage + 1;
        urlParams.set("page", page);
        $(this).attr('href', "?" + urlParams.toString());
    });
});