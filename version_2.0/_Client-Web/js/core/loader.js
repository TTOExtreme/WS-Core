
/**
 * Carrega JS externo, somente se o mesmo nao esta carregado
 * @param {URL} url 
 * @param {Function} afterload 
 * @param {Element} location 
 */
function loadJS(url, afterload = () => { }, location) {
    let checksum = StringUnique(url);
    if (document.getElementById(checksum) != undefined) { afterload(); return; }

    let scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.id = checksum;

    scriptTag.onload = afterload;
    scriptTag.onreadystatechange = afterload;

    location.appendChild(scriptTag);
};

/**
 * 
 * @param {String} str 
 * @param {Integer} seed 
 * @returns 
 */
function StringUnique(str, seed = 126) {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

/**
 * Carrega JS externo, somente se o mesmo nao esta carregado
 * @param {URL} url 
 * @param {Function} afterload 
 * @param {Element} location 
 */
function loadCSS(url, afterload = () => { }, location) {
    let checksum = StringUnique(url);
    if (document.getElementById(checksum) != undefined) { afterload(); return; }

    let linkTag = document.createElement('link');
    linkTag.rel = "stylesheet"
    linkTag.href = url;
    linkTag.id = checksum;

    linkTag.onload = afterload;
    linkTag.onreadystatechange = afterload;

    location.appendChild(linkTag);
};