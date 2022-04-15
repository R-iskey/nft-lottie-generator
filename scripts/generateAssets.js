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
    const {width, height, assetsPath} = configs;
    return imagePaths.map((imagePath) => {
        const shortFileName = last(imagePath.split('/')).split('.')[0];
        return new Asset(shortFileName.toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll('-', '_'),
            width, height, assetsPath + '/',
            imagePath
        )
    })
}

module.exports = generateAssets;
