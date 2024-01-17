$(document).on('click', '.dropdown-menu', function (e) {
    e.stopPropagation();
});

$(document).on('click', '.dropdown-item', function (e) {
    const wards = [];
    $('ul>li>a>input[type="checkbox"]').each(function () {
        if ($(this).prop('checked')) {
            wards.push($(this).val());
        }
    });
    $.ajax({
        url: '/district-officer/ads-location',
        type: 'POST',
        data: wards,
        success: function (data) {
            $('#adsLocationTable').html(data);
        }
    });
});
$('#searchForm').on('submit', function (e) {
    e.preventDefault();
    const keyword = $('#searchForm input[name="keyword"]').val();
    console.log(keyword);
    const wards = [];
    $('ul>li>a>input[type="checkbox"]').each(function () {
        if ($(this).prop('checked')) {
            wards.push($(this).val());
        }
    });
    const url = `/district-officer/ads-panel/?keyword=${keyword}&wards=${wards.join(',')}`;

    console.log(url);
    $.ajax({
        url: url,
        type: 'POST',
        data: {keyword,
            wards},
        success: function (data) {
            console.log(data);
            addToTable(data);
        }
    });
});

function addToTable(data){
    $('#tableContent').html("");
    console.log("data",data.arrayAdsPanel.length)
    for(let i = 0; i < data.arrayAdsPanel.length; i++){
        let html = `<tr>
            <th scope="row">
                <span class="d-flex justify-content-center">
                    ${data.arrayAdsPanel[i].stt}
                </span>
            </th>
            <td>
                <span class="d-flex justify-content-center">
                    ${data.arrayAdsPanel[i].location_name}
                </span>
            </td>
            <td>
                <span class="d-flex justify-content-center">
                    ${data.arrayAdsPanel[i].ads_panel_type_name}
                </span>
            </td>
            <td>
                <span class="d-flex justify-content-center">
                    ${data.arrayAdsPanel[i].width}m x ${data.arrayAdsPanel[i].height}m
                </span>
            </td>
            <td>
                <span class="d-flex justify-content-center">
                    ${data.arrayAdsPanel[i].quantity}
                </span>
            </td>
            <td>
                <div class="d-flex justify-content-center">
                    <a class="d-flex view-detail mt-1" href="/district-officer/ads-panel/view-panel-detail?adsPanelId=${data.arrayAdsPanel[i].adsPanelId}" role="button">
                        <span class="ml-1">Xem chi tiết</span>
                    </a>
                </div>
            </td>
            <td>
                <div class="d-flex justify-content-center">
                    <a class="d-flex view-detail mt-1" href="/district-officer/ads-panel/ads-panel-edit?adsPanelId=${data.arrayAdsPanel[i].adsPanelId}" role="button">
                        <span class="ml-1">Yêu cầu</span>
                    </a>
                </div>
            </td>
            <td>
                <div class="d-flex justify-content-center">
                    <a class="d-flex view-detail mt-1" href="#" role="button">
                        <span class="ml-1">Yêu cầu</span>
                    </a>
                </div>
            </td>
        </tr>`
        $('#tableContent').append(html);
    }
}