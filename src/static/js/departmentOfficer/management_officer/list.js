$(document).ready(function () {
    activateDistrict($('#selectedDistrictId').val());

    function activateDistrict(selectedDistrictId) {
        $('.districts ul.dropdown-menu .dropdown-item').removeClass('active');
    
        $('.districts ul.dropdown-menu .dropdown-item[data-id="' + selectedDistrictId + '"]').addClass('active');
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