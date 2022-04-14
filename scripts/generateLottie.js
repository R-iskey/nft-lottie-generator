const lottieSkeleton = require('../skeletons/lottieSkeleton.json');
const configs = require('../configs');
const fs = require('fs');

function generateLottie(layers, assets) {
    lottieSkeleton.fr = 25;
    lottieSkeleton.ip = 0;
    lottieSkeleton.op = layers.length * 28;
    lottieSkeleton.w = configs.width;
    lottieSkeleton.h = configs.height;
    lottieSkeleton.nm = 'Full Animation';
    lottieSkeleton.assets = assets;
    lottieSkeleton.layers = layers;
    
    fs.writeFileSync(`${configs.lottieOutDir}/result.json`, JSON.stringify(lottieSkeleton, null, 2));
    
    return lottieSkeleton;
}

module.exports = generateLottie;
