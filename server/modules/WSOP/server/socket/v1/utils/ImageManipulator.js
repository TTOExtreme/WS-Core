const path = require('path');
const gm = require('gm').subClass({ imageMagick: true });
const fs = require('fs');

class ImageManipulator {
    constructor() {
    }

    isValidMedia(src) {
        return /\.(jpe?g|png)$/.test(src);
    }

    isValidBaseDir(src) {
        return /^\/public\/images/.test(src);
    }

    thumb(fileInput, fileOutput, max_width, max_height) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(fileInput)) {
                let img = gm(fileInput);
                img.size(function (err, value) {
                    if (err) { reject(err); return; }
                    if (!value) { reject("Image Undefined"); return; }
                    let ratio = ((max_width / value.width < max_height / value.height) ? max_width / value.width : max_height / value.height);
                    let resolved = false;
                    console.log((value.width * ratio).toFixed(0) + " " + (value.height * ratio).toFixed(0) + " R:" + ratio + " w:" + value.width)
                    img.resize((value.width * ratio).toFixed(0), (value.height * ratio).toFixed(0)).write(fileOutput, () => { resolved = true; resolve(); });
                    setTimeout(() => { if (!resolved) { reject("Timeout") } }, 20000);
                })
            }
        })
    }
}

module.exports = { ImageManipulator };