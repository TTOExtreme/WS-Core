function formatTime(data) {
    let ret = "-"
    if (data != undefined && data != "") {
        let date = new Date(parseInt(data));
        let day = "0" + date.getDate();
        let month = "0" + (date.getMonth() + 1);
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = "0" + date.getMinutes();
        let seconds = "0" + date.getSeconds();
        ret = (day.substr(-2) + '/' + month.substr(-2) + '/' + year) + "-" + (hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2));
    }
    return ret;
}

function formatTimeAMD(data) {
    let ret = "-"
    if (data != undefined && data != "") {
        let date = new Date(parseInt(data));
        let day = "0" + date.getDate();
        let month = "0" + (date.getMonth() + 1);
        let year = date.getFullYear();
        ret = (year + '-' + month.substr(-2) + '-' + day.substr(-2));
    }
    return ret;
}

function formatTimeDMA(data) {
    let ret = "-"
    if (data != undefined && data != "") {
        let date = new Date(parseInt(data));
        let day = "0" + date.getDate();
        let month = "0" + (date.getMonth() + 1);
        let year = date.getFullYear();
        ret = (day.substr(-2) + '-' + month.substr(-2) + '-' + year);
    }
    return ret;
}