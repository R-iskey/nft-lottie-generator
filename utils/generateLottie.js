const lottieSkeleton = require('../skeletons/lottieSkeleton.json');
const configs = require('../configs');

function generateLottie(layers, assets) {
    lottieSkeleton.fr = 25;
    lottieSkeleton.ip = 0;
    lottieSkeleton.op = layers.length * 28;
    lottieSkeleton.w = configs.width;
    lottieSkeleton.h = configs.height;
    lottieSkeleton.nm = 'Full Animation';
    lottieSkeleton.assets = assets;
    lottieSkeleton.layers = layers;
    
    return lottieSkeleton;
}

module.exports = generateLottie;
