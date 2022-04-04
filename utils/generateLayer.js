const layerSample = require('../skeletons/layerSkeleton.json');
const configs = require('../configs');

class Layer {
    constructor(index, name, refId, startFrame, endFrame, st) {
        this.ind = index;
        this.nm = name;
        this.refId = refId;
        this.w = configs.width;
        this.h = configs.height;
        this.ip = startFrame;
        this.op = endFrame;
        this.st = st;
    }
}

function generateLayer(composition, index) {
    const ind = index + 1;
    const layer = new Layer(
        ind,
        `animation_${ind}`,
        composition.id,
        index * 28,
        ind * 28,
        index * 28
    );
    
    return {
        ...layerSample,
        ...layer
    }
}

module.exports = generateLayer;
