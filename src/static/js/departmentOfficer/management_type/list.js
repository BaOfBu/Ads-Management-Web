$(document).ready(function () {
    activateChoice($('#selectedChoice').val());

    function activateChoice(selectedChoice) {
        $('.types ul.dropdown-menu .dropdown-item').removeClass('active');
    
        $('.types ul.dropdown-menu .dropdown-item[data-id="' + selectedChoice + '"]').addClass('active');
    }
});