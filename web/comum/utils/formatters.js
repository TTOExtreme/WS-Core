function formatTime(data) {
    var ret = "-"
    if (data != undefined && data != "") {
        var date = new Date(parseInt(data));
        var day = "0" + date.getDate();
        var month = "0" + (date.getMonth() + 1);
        var year = date.getFullYear();
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        ret = (day.substr(-2) + '/' + month.substr(-2) + '/' + year) + "-" + (hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2));
    }
    return ret;
}