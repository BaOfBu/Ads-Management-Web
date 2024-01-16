$('.districts ul.dropdown-menu').on('click', '.dropdown-item', function() {
    console.log("Đã click");
    let selectedDistrictId = $(this).data('id');
    let selectedDistrictName = $(this).data('value');
    $('#selectedDicstrictId').val(selectedDistrictId);
    console.log("selected: ", selectedDistrictName);

    if(selectedDistrictId === -1) {
        $('#dropdownDistrict').text(selectedDistrictName);
        const emptyArray = [];
        populateWardsDropdown(emptyArray);
    }else{
        $('#dropdownDistrict').text('Quận ' + selectedDistrictName);   
        $.ajax({
            url: 'ads-location/get-ward-by-district',
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
    activateDistrict(selectedDistrictId);
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
    dropdownWard.append('<li><a class="dropdown-item active" data-value="Tất cả phường" data-id="-1">Tất cả phường</a></li>');
    for (let i = 0; i < wards.length; i++) {
        let ward = wards[i];
        dropdownWard.append('<li><a class="dropdown-item" data-value="' + ward.name + '" data-id="' + ward.wardId + '">Phường ' + ward.name + '</a></li>');
    }
}

$('.wards ul.dropdown-menu').on('click', '.dropdown-item', function() {
    let selectedDistrictId = $('#selectedDicstrictId').val();
    let selectedWardId = $(this).data('id');
    let selectedWardName = $(this).data('value');
    if(selectedWardId === -1){
        $('#dropdownWard').text(selectedWardName);
    }else{
        $('#dropdownWard').text('Phường ' + selectedWardName);
    }
    
    activateWard(selectedWardId);
    $.ajax({
        url: 'ads-location/get-list-by-ward',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ districtId: selectedDistrictId, wardId: selectedWardId }),
        success: async function(response) {
            console.log("response: ", response);
            displayListByWard(response.list);
            $('#dateSpan').text(response.date);
        },
        error: function(error) {
            console.error('Error fetching wards:', error);
        }
    });
});

function displayListByWard(list) {
    if(list.length === 0){
        let newDiv = '<div class="card-body">Không có dữ liệu</div>';
        $('.list').children().eq(1).remove();
        $('.list').children().last().before(newDiv);
    }else{
        $('table').remove();
        console.log("Có list: ", $('.list').children());
        if ($('.list').children().length === 3) {
            $('.list').children().eq(1).remove();
            console.log("Đã xóa");
        }
        let table = '<table class="table table-hover">'+
        '<thead>'+
            '<tr>'+
                '<th scope="col" class="col-1">#</th>' + 
                '<th scope="col" class="col-2">Địa chỉ</th>' +
                '<th scope="col" class="col-2">Loại vị trí</th>' +
                '<th scope="col" class="col-2">Hình thức quảng cáo</th>' +
                '<th scope="col" class="col-2">Khu vực</th>' +
                '<th scope="col" class="col-1">Hành động</th>' +
                '<th scope="col" class="col-2"></th>' 
            +'</tr>'+
        '</thead>'+
        '<tbody>'+
        '</tbody>'
        +'</table>';
        $('.list').children().last().before(table);
        for(let i = 0; i < list.length; i++){
            let newRow = '<tr>' +
            '<td>' + list[i].stt + '</td>' +
            '<td>' + list[i].location + '</td>' +
            '<td>' + list[i].location_type_name + '</td>' +
            '<td>' + list[i].ads_type_name + '</td>' +
            '<td>Phường ' + list[i].ward_name + ' - Quận ' + list[i].district_name +  '</td>' +
            '<td>' +
                '<div class="d-flex justify-content-center">' +
                    `<a class="btn btn-sm btn-outline-info" href="district/edit?adsLocationId=${list[i].adsLocationId}" role="button">` +
                        '<img src="/static/images/departmentOfficer/icon-edit.png" width="24" height="24" alt="edit this row">' +
                    '</a>' +
                '</div>' +
            '</td>' +
            '<td class="d-flex">'+
                '<div>' +
                    `<a class="d-flex view-detail mt-1" href="ads-location/view-detail?adsLocationId=${list[i].adsLocationId}&stt=${list[i].stt}" role="button">` +
                    '<img src="/static/images/departmentOfficer/icon-view-detail.png" width="24" height="24" alt="view detail">' +
                        '<span class="ml-1">Xem chi tiết</span>' +
                    '</a>' +
                '</div>' +
            '</td>' +
            '</tr>';
            $('tbody').append(newRow);
        }
        console.log("tbody: ", $('tbody'));
    }
}