//load menu items
var root = document.location.href + "js/";
var rootCSS = document.location.href + "css/";

var libs = [
    root + "bin/utils/userDefined.js",
    root + "bin/utils/cookie.js",
    root + "bin/utils/loader.js",
    root + "lib/crypto-js/crypto-js.js",
    root + "lib/bcypher.js",
    root + "lib/ipNetmask-List.js",
    //root + "lib/table/ag-grid-community.min.js",
    root + "lib/table/js/tabulator.min.js",
    root + "bin/socket/db.js",
    root + "bin/screens/login.js",
    root + "bin/socket/socket.js",
    root + "bin/menu/credits.js",
]

var csss = [
    rootCSS + "tables.css",
    rootCSS + "main.css",
    root + "lib/table/css/tabulator.css"
]

var loading = true;

function loader(libid) {
    if (libs[libid] != undefined) {
        $.getScript(libs[libid], function () { loader(libid + 1); })
    } else {
        loading = false;
    }
}
function cssloader(cssid) {
    if (csss[cssid] != undefined) {
        getStylesheet(csss[cssid], function () { cssloader(cssid + 1); })
    } else {
        loader(0);
    }
}

function loadScript(scrp) {
    if (!loading) {
        //console.log(root + scrp);
        $.getScript(root + scrp, function () { });
    } else {
        setTimeout(function () { loadScript(scrp); }, 1000);
    }
}

function loadAddonScript(scrp) {
    if (!loading) {
        $.getScript(root + scrp, function () { });
    } else {
        setTimeout(function () { loadScript(scrp); }, 1000);
    }
}

function loadAddonMainScript(scrp) {
    if (!loading) {
        libs.push(root + scrp, function () { });
    } else {
        $.getScript(root + scrp, function () { });
    }
}

function loadAddonScriptCall(scrp, callback) {
    if (!loading) {
        $.getScript(root + scrp, function () { callback(); });
    } else {
        setTimeout(function () { loadScriptCall(scrp, callback); }, 1000);
    }
}

function wait_Load(callback) {
    if (!loading) {
        callback();
    } else {
        setTimeout(function () { wait_Load(callback); }, 1000);
    }
}

function loadMainScripter(scpt) {
    if (loading) {
        libs.push(root + scpt)
    } else {
        $.getScript(root + scpt, function () { });
    }
}


function loadCSS(scrp) {
    if (!loading) {
        getStylesheet(rootCSS + scrp, function () { });
    } else {
        setTimeout(function () { loadCSS(scrp); }, 1000);
    }
}
function loadCSSCall(scrp, callback) {
    if (!loading) {
        getStylesheet(rootCSS + scrp, function () { callback() });
    } else {
        setTimeout(function () { loadCSSCall(scrp, callback); }, 1000);
    }
}
function getStylesheet(path, callback) {
    var link = document.createElement('link');
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.onload = function () { callback(); }
    link.setAttribute("href", path);
    document.getElementsByTagName("head")[0].appendChild(link);
};

cssloader(0);