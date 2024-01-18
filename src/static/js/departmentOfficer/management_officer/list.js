$(document).ready(function () {
    activateRole($('#selectedRole').val());

    function activateRole(selectedRole) {
        $('.roles ul.dropdown-menu .dropdown-item').removeClass('active');
    
        $('.roles ul.dropdown-menu .dropdown-item[data-id="' + selectedRole + '"]').addClass('active');
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