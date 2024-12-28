/**
 * 
 * @param {array} list
 * @description Carrega os items externos na lista em ordem
 */
function loadExternalFiles(list) {
    let extLoaders = [];
    if (list.length > 0) {
        list.forEach(item => {
            extLoaders.push(loadExternal(item));
        })
    }
    return Promise.all(extLoaders);
}


/**
 * 
 * @param {string} path 
 */
function loadExternal(path) {
    return new Promise(function (resolve, reject) {
        if (document.getElementById("ext_" + path.replace(new RegExp("/", "g"), ".")) != undefined) {
            document.getElementsByTagName("head")[0].removeChild(
                document.getElementById("ext_" + path.replace(new RegExp("/", "g"), ".")));
        }
        let extmod;
        if (path.indexOf(".js") > -1) {
            extmod = document.createElement('script');
            extmod.setAttribute("type", "text/javascript");
            extmod.setAttribute("id", "ext_" + path.replace(new RegExp("/", "g"), "."))
            extmod.onload = function () { resolve(); }
            extmod.setAttribute("src", path);
        }
        if (path.indexOf(".css") > -1) {
            extmod = document.createElement('link');
            extmod.setAttribute("rel", "stylesheet");
            extmod.setAttribute("type", "text/css");
            extmod.setAttribute("id", "ext_" + path.replace(new RegExp("/", "g"), "."))
            extmod.onload = function () { resolve(); }
            extmod.setAttribute("href", path);
        }
        document.getElementsByTagName("head")[0].appendChild(extmod);

    })
};
