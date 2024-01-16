$(document).ready(function() {
    let dataReportType;
    let chartReportType;
    let dataObject;
    let chartObject;

    $.ajax({
        url: 'citizen-report/get-report-by-ward',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ districtId: -1, wardId: -1 }),
        success: function(response) {
            console.log("response: ", response);
            $("#total-report").text(response.totalReport);
            $("#total-processing").text(response.totalProcessing);
            $("#total-processed").text(response.totalProcessed);

            dataReportType = {
                labels: Object.keys(response.totalReportType),
                datasets: [{
                    data: Object.values(response.totalReportType), 
                    backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(255, 205, 86, 0.7)', 'rgba(54, 162, 235, 0.7)'],
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 205, 86, 1)', 'rgba(54, 162, 235, 1)'],
                    borderWidth: 1
                }]
            };

            let optionsReportType = {
                responsive: true,
                maintainAspectRatio: false
            };

            let ctxReportType = $('#chartReportType')[0].getContext('2d');
            chartReportType = new Chart(ctxReportType, {
                type: 'pie',
                data: dataReportType,
                options: optionsReportType
            });

            dataObject = {
                labels: ["Số báo cáo điểm vi phạm", "Số báo cáo bảng vi phạm"],
                datasets: [{
                    data: [response.totalPoint, response.totalPanel], 
                    backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'],
                    borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
                    borderWidth: 1
                }]
            };

            let optionsObject = {
                responsive: true,
                maintainAspectRatio: false
            };

            let ctxObject = $('#chartObject')[0].getContext('2d');
            chartObject = new Chart(ctxObject, {
                type: 'pie',
                data: dataObject,
                options: optionsObject
            });

            $('#dateSpan').text(response.date);
        },
        error: function(error) {
            console.error('Error fetching wards:', error);
        }
    });

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
            url: 'citizen-report/get-report-by-ward',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ districtId: selectedDistrictId, wardId: selectedWardId }),
            success: async function(response) {
                console.log("response: ", response);
                $('tbody').empty();
                $("#total-report").text(response.totalReport);
                $("#total-processing").text(response.totalProcessing);
                $("#total-processed").text(response.totalProcessed);
                updateChartObjectData([response.totalPoint, response.totalPanel]);
                updateChartReportTypeData(Object.values(response.totalReportType));
                
                // displayStatisticsbyWard(response.totalReport, response.totalProcessing, response.totalProcessed, 
                //     response.totalReportType, response.totalPoint, response.totalPanel);
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

    // function displayStatisticsbyWard(totalReport, totalProcessing, totalProcessed, totalReportType, totalPoint, totalPanel){
    //     $("#total-report").text(totalReport);
    //     $("#total-processing").text(totalProcessing);
    //     $("#total-processed").text(totalProcessed);

    //     let dataReportType = {
    //         labels: Object.keys(totalReportType),
    //         datasets: [{
    //             data: Object.values(totalReportType), 
    //             backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(255, 205, 86, 0.7)', 'rgba(54, 162, 235, 0.7)'],
    //             borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)', 'rgba(255, 205, 86, 1)', 'rgba(54, 162, 235, 1)'],
    //             borderWidth: 1
    //         }]
    //     };
    
    //     let optionsReportType = {
    //         responsive: true,
    //         maintainAspectRatio: false
    //     };
    
    //     let ctxReportType = $('#chartReportType')[0].getContext('2d');
    //     let chartReportType = new Chart(ctxReportType, {
    //         type: 'pie',
    //         data: dataReportType,
    //         options: optionsReportType
    //     });

    //     let dataObject = {
    //         labels: ["Số báo cáo điểm vi phạm", "Số báo cáo bảng vi phạm"],
    //         datasets: [{
    //             data: [totalPoint, totalPanel], 
    //             backgroundColor: ['rgba(75, 192, 192, 0.7)', 'rgba(255, 99, 132, 0.7)'],
    //             borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
    //             borderWidth: 1
    //         }]
    //     };
    
    //     let optionsObject = {
    //         responsive: true,
    //         maintainAspectRatio: false
    //     };
    
    //     let ctxObject = $('#chartObject')[0].getContext('2d');
    //     let chartObject = new Chart(ctxObject, {
    //         type: 'pie',
    //         data: dataObject,
    //         options: optionsObject
    //     });
    // }

    function updateChartObjectData(data){
        dataObject.datasets[0].data = data;
        console.log(dataObject.datasets[0].data );
        chartObject.update();
    }

    function updateChartReportTypeData(data){
        dataReportType.datasets[0].data = data;
        console.log(dataReportType.datasets[0].data );
        chartReportType.update();
    }
    
});