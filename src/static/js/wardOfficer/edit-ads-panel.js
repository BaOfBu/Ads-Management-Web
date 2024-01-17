$('#formAdsPanelEdit').on("submit",function (e) {
    e.preventDefault();
    const form = $(this);
    const width = $('#txtWidth').val();
    const height = $('#txtHeight').val();
    const Quantity = $('#txtQuantity').val();
    console.log(width);
    console.log(height);
    console.log(Quantity);
    if(width === '' || height === '' || Quantity === ''){
        alert('Vui lòng nhập đầy đủ thông tin');
        return;
    }
    if(width <= 0 || height <= 0 || Quantity <= 0){
        alert('Vui lòng nhập thông tin hợp lệ');
        return;
    }
    if(isNaN(width) || isNaN(height) || isNaN(Quantity)){
        alert('Vui lòng nhập thông tin hợp lệ');
        return;
    }
    $('#formAdsPanelEdit').unbind('submit').submit();
});