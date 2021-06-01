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

function formatTimeSpend(data) {
    let ret = "-"
    if (data != undefined && data != "") {
        // Pad to 2 or 3 digits, default is 2
        function pad(n, z) {
            z = z || 2;
            return ('00' + n).slice(-z);
        }
        let s = data;
        let ms = s % 1000;
        s = (s - ms) / 1000;
        let secs = s % 60;
        s = (s - secs) / 60;
        let mins = s % 60;
        s = (s - mins) / 60;
        let hrs = s % 24;
        s = (s - hrs) / 24;
        let dias = s / 30;

        if (dias > 0 && ret == "-") ret = (dias) + " " + pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
        if (hrs > 0 && ret == "-") ret = pad(hrs) + ':' + pad(mins) + ':' + pad(secs);
        if (ret == "-") ret = pad(mins) + ':' + pad(secs);
    }
    return ret;
}
