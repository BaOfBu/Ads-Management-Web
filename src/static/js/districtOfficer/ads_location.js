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
    const url = `/district-officer/ads/?keyword=${keyword}&wards=${wards.join(',')}`;

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
    console.log("data",data.arrayAdsLocation.length)
    for(let i = 0; i < data.arrayAdsLocation.length; i++){
        console.log("hello");
        let html = `<tr>
        <td><span class="d-flex justify-content-center">${data.arrayAdsLocation[i].stt}</span></td>
        <td><span class="d-flex justify-content-center">${data.arrayAdsLocation[i].location}</span></td>
        <td><span class="d-flex justify-content-center">${data.arrayAdsLocation[i].location_type_name}</span></td>
        <td><span class="d-flex justify-content-center">${data.arrayAdsLocation[i].ads_type_name}</span></td>
        <td><span class="d-flex justify-content-center">${data.arrayAdsLocation[i].status}</span></td>
        <td>
            <div class="d-flex justify-content-center">
                <a class="d-flex view-detail mt-1" href="ads/view-detail?adsLocationId=${data.arrayAdsLocation[i].adsLocationId}" role="button">
                    <img src="/static/images/departmentOfficer/icon-view-detail.png" width="24" height="24" alt="view detail">
                    <span class="ml-1">Danh sách</span>
                </a>
            </div>
        </td>
        <td>
            <div class="d-flex justify-content-center">
                <a class="d-flex view-detail mt-1" href="ads/ads-location-edit?adsLocationId=${data.arrayAdsLocation[i].adsLocationId}">
                    Yêu cầu
                </a>
            </div>
        </td>`;
        $('#tableContent').append(html);
    }
}