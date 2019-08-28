//load menu items
var rootLocation = document.location.origin + "/";

var libs = [
    rootLocation + "comum/utils/index.js",
    rootLocation + "comum/socket/index.js",
    rootLocation + "comum/screen/index.js"
]

var csss = [
    rootLocation + "comum/css/tables.css",
    rootLocation + "comum/css/main.css",
    rootLocation + "comum/css/tabulator.css"
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
    }
}

function loadScript(scrp) {
    if (!loading) {
        //console.log(rootLocation + scrp);
        $.getScript(rootLocation + scrp, function () { });
    } else {
        setTimeout(function () { loadScript(scrp); }, 1000);
    }
}

function loadAddonScript(scrp) {
    if (!loading) {
        $.getScript(rootLocation + scrp, function () { });
    } else {
        setTimeout(function () { loadScript(scrp); }, 1000);
    }
}

function loadAddonMainScript(scrp) {
    if (!loading) {
        libs.push(rootLocation + scrp, function () { });
    } else {
        $.getScript(rootLocation + scrp, function () { });
    }
}

function loadAddonScriptCall(scrp, callback) {
    if (!loading) {
        $.getScript(rootLocation + scrp, function () { callback(); });
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

function loadScript_add(scpt) {
    if (loading) {
        libs.push(rootLocation + scpt)
    } else {
        $.getScript(rootLocation + scpt, function () { });
    }
}


function loadCSS(scrp) {
    if (!loading) {
        getStylesheet(rootLocation + scrp, function () { });
    } else {
        setTimeout(function () { loadCSS(scrp); }, 1000);
    }
}
function loadCSSCall(scrp, callback) {
    if (!loading) {
        getStylesheet(rootLocation + scrp, function () { callback() });
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
loader(0);