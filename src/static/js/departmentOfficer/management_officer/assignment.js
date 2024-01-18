$(document).ready(function () {
    updateDropdowns();
    $("#roleSelect").change(function () {
        updateDropdowns();
    });
    $("#district").change(function () {
        if ($("#roleSelect").val() == "Cán bộ phường") {
            fetchWardsAndUpdateDropdown();
        }
    });
    $("#update-btn").on("click", function (event) {
        event.preventDefault();
        var selectedRole = $("#roleSelect").val(); // Cán bộ phường, Cán bộ quận
        var selectedDistrictId = $("#district").val(); //District Name
        var wardDropdown = $("#ward").val(); //wardId
        $.getJSON(
            `/department-officer/management-officer/updateAccountRole`,
            {
                accountId: accountId,
                role: selectedRole,
                district: selectedDistrictId,
                ward: wardDropdown
            },
            function (data) {
                if (data == true) {
                    alert("Cập nhật thành công");
                }
            }
        );
    });
});

function updateDropdowns() {
    var selectedRole = $("#roleSelect").val();
    if (selectedRole == "Cán bộ phường") {
        $("#wardBlock").show();
    } else {
        $("#wardBlock").hide();
    }
    if (selectedRole == "Cán bộ phường") {
        fetchWardsAndUpdateDropdown();
    }
}

function fetchWardsAndUpdateDropdown() {
    var selectedDistrictId = $("#district").val();
    $.getJSON(`/department-officer/management-officer/list-ward`, { district: selectedDistrictId }, function (data) {
        updateWardDropdown(data);
    });
}
function updateWardDropdown(data) {
    var wardDropdown = $("#ward");
    wardDropdown.empty();
    console.log(wardCurrent);
    if (data == false) {
    } else if (!data) {
    } else if (data.length > 1) {
        data.forEach(function (ward) {
            if (ward.wardId == wardCurrent) {
                wardDropdown.append(`<option value="${ward.wardId}" selected>Phường ${ward.name}</option>`);
            }
            wardDropdown.append(`<option value="${ward.wardId}">Phường ${ward.name}</option>`);
        });
    } else {
        if (ward.wardId == wardCurrent) {
            wardDropdown.append(`<option value="${ward.wardId}" selected>Phường ${ward.name}</option>`);
        } else wardDropdown.append(`<option value="${data.wardId}">Phường ${data.name}</option>`);
    }
}
