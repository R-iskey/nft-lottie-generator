const configs = require('../configs');
const {last} = require('lodash');

class Asset {
    constructor(id, w, h, path, fileName) {
        this.id = id;
        this.w = w;
        this.h = h;
        this.u = path;
        this.p = fileName;
    }
}


function generateAssets(imagePaths) {
    const {width, height, staticPath} = configs;
    return imagePaths.map((imagePath) => {
        const shortFileName = last(imagePath.split('/')).split('.')[0];
        return new Asset(shortFileName
            .replaceAll(' ', '_')
            .replaceAll('-', '_'),
            width, height, staticPath + '/',
            imagePath
        )
    })
}

module.exports = generateAssets;
