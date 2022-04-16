const lottieSkeleton = require('../skeletons/lottieSkeleton.json');
const configs = require('../configs');
const fs = require('fs-extra');
const {getAssetPath, getCopyAssetPath, getBuildPath} = require('../utils/directories');
const path = require('path');

function generateLottie(layers, assets) {
    lottieSkeleton.fr = 25;
    lottieSkeleton.ip = 0;
    lottieSkeleton.op = layers.length * 28;
    lottieSkeleton.w = configs.width;
    lottieSkeleton.h = configs.height;
    lottieSkeleton.nm = 'Full Animation';
    lottieSkeleton.assets = assets;
    lottieSkeleton.layers = layers;
    
    fs.copySync(
        getAssetPath(),
        getCopyAssetPath()
    );
    
    fs.writeJsonSync(
        path.join(getBuildPath(), 'result.json'),
        lottieSkeleton,
        {spaces: 2}
    );
    
    return lottieSkeleton;
}

module.exports = generateLottie;
