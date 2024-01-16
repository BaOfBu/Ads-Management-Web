$(document).ready(function() {
    $('.districts ul.dropdown-menu').on('click', '.dropdown-item', function() {
        console.log("Đã click");
        let selectedDistrictId = $(this).data('id');
        let selectedDistrictName = $(this).data('value');
        console.log("selected: ", selectedDistrictName);

        $('#dropdownDistrict').text('Quận ' + selectedDistrictName);
        activateDistrict(selectedDistrictId);
        $.ajax({
            url: 'citizen-report/get-ward-by-district',
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
            url: 'citizen-report/get-report-by-ward',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ wardId: selectedWardId }),
            success: function(response) {
                $('tbody').empty();
                displayListReportByWard(response.report);
                $('#dateSpan').text(response.date);
            },
            error: function(error) {
                console.error('Error fetching wards:', error);
            }
        });
    });

    function displayListReportByWard(report) {
        if(report.length === 0){
            let newDiv = '<div class="card-body">Không có dữ liệu</div>';
            $('.list').children().eq(1).remove();
            $('.list').children().last().before(newDiv);
        }else{
            $('table').remove();
            console.log("Có report: ", $('.list').children());
            if ($('.list').children().length === 3) {
                $('.list').children().eq(1).remove();
                console.log("Đã xóa");
            }
            let table = '<table class="table table-hover">'+
            '<thead>'+
                '<tr>'+
                    '<th scope="col" style="width: 2%">#</th>' +
                    '<th scope="col" style="width: 13%">Đối tượng báo cáo</th>' +
                    '<th scope="col" style="width: 10%">Loại báo cáo</th>' +
                    '<th scope="col" style="width: 10%">Người gửi</th>' + 
                    '<th scope="col" style="width: 17%">Nội dung</th>' +
                    '<th scope="col" style="width: 28%">Cách thức xử lý</th>' +
                    '<th scope="col" style="width: 10%">Thời gian gửi</th>' +
                    '<th scope="col" style="width: 10%">Trạng thái</th>'
                +'</tr>'+
            '</thead>'+
            '<tbody>'+
            '</tbody>'
            +'</table>';
            $('.list').children().last().before(table);
            for(let i = 0; i < report.length; i++){
                let newRow = '<tr>' +
                '<td>' + report[i].stt + '</td>' +
                '<td>' + report[i].object + '</td>' +
                '<td>' + report[i].report_type_name + '</td>' +
                '<td>' + report[i].name + '</td>' +
                '<td>' + report[i].content + '</td>' +
                '<td>' + report[i].handlingProcedureInfor + '</td>' +
                '<td>' + report[i].sendDate + '</td>' +
                '<td>' + report[i].status + '</td>' +
                '</tr>';
                $('tbody').append(newRow);
            }
            console.log("tbody: ", $('tbody'));
        }
    }
});