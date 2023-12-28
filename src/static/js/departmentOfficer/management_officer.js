$('#txtDoB').datetimepicker({
    timepicker: false,
    format: 'd/m/Y',
    mask: true
});

$('#frmRegister').on('submit', function (e) {
    e.preventDefault();
})