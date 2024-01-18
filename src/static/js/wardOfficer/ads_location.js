function getKeyword(){
    var keyword = document.getElementById("keyword").value;
    return keyword;
}

function setHref(value){
    var keyword = getKeyword();
    var href = "?page=" + value + "&" + "keyword="+keyword;
    document.getElementById("href").setAttribute("href", href);
}