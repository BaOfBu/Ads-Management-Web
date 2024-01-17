$(document).ready(function () {
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
        const districtId = $('#selectedDistrictId').val();
        // const page = $('#page').val();

        let dropdownWard = $('.wards ul.dropdown-menu');
    
        dropdownWard.empty();
    
        console.log("wards: ", wards);
        dropdownWard.append(`<li><a href="ads-location?districtId=${districtId}&wardId=-1&page=1" class="dropdown-item active" data-value="Tất cả phường" data-id="-1">Tất cả phường</a></li>`);
        for (let i = 0; i < wards.length; i++) {
            let ward = wards[i];
            dropdownWard.append(`<li><a href="ads-location?districtId=${districtId}&wardId=${ward.wardId}&page=1" class="dropdown-item" data-value="` + ward.name + '" data-id="' + ward.wardId + '">Phường ' + ward.name + '</a></li>');
        }
    }

    $('#previousPage').on('click', function(){
        // let nextPage = document.getElementById("previousPage");
        let urlParams = new URLSearchParams(window.location.search);
        let page = urlParams.get('page') || 1;
        let currentPage = Number(page);
        page = currentPage - 1;
        urlParams.set("page", page);
        nextPage.setAttribute('href', "?" + urlParams);
    });
      
      
    $('#nextPage').on('click', function(){
        console.log("Đã next page");
        let urlParams = new URLSearchParams(window.location.search);
        let page = urlParams.get('page') || 1;
        let currentPage = Number(page);
        page = currentPage + 1;
        urlParams.set("page", page);
        nextPage.setAttribute('href', "?" + urlParams);
    });
});