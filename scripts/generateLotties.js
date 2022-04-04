const fs = require('fs');
const configs = require('../configs');
const {last, clone} = require('lodash');
const sample = require('../skeletons/lottieSkeleton.json');
const layerSample = require('../skeletons/layerSkeleton.json');
const compositionSample = require('../skeletons/compositionSkeleton.json');
const assetsSample = require('../skeletons/assetsSkeleton.json');

const assetsPaths = [
    {
        type: 'eyes',
        path: configs.staticPath,
        images: ['Eyes/Eyes_x.png', 'Eyes/Sunglasses.png']
    },
    {
        type: 'leftHand',
        path: configs.staticPath,
        images: [
            'Hands/Left/Scythe.png',
            'Hands/Left/Balloon_animals_04.png',
            'Hands/Left/Flame_ball.png',
            'Hands/Left/Hockey_Stick.png'
        ]
    },
    {
        type: 'rightHand',
        path: configs.staticPath,
        images: [
            'Hands/Right/Slurpee.png',
            'Hands/Right/Super_soaker.png',
            'Hands/Right/Vampire_Crucifix.png',
            'Hands/Right/Cleaver.png',
            'Hands/Right/Wiskey.mov',
            'Hands/Right/Bear.mov',
        ]
    },
    {
        type: 'head',
        path: configs.staticPath,
        images: [
            'Heads/Ring.png',
            'Heads/Cap1_3.png',
            'Heads/Rainbow_and_clouds.mov',
        ]
    },
    {
        type: 'body',
        path: configs.staticPath,
        images: [
            'Bodies/Body.mov',
        ]
    },
    {
        type: 'mouth',
        path: configs.staticPath,
        images: [
            'Heads/Ring.png',
            'Mouths/Bubble_gum.mov'
        ]
    }
];

// 0 = static image, 1 = animated presenter
const partsAssetMap = {
    eyes: ['image_5', 'image_5'],
    leftHand: ['image_8', 'image_8'],
    rightHand: ['image_1', 'image_27'],
    head: ['image_3', 'image_3'],
    mouth: ['image_4', 'image_4'],
    body: ['image_6', 'image_6']
};

module.exports = function generateLotties(count, shouldExport) {
    const json = {...sample};
    
    
    for (let i = 0; i < count; i++) {
        const newAssetsSample = clone(assetsSample);
    
        const lastImage = last(
            json.assets.filter(a => a.id.startsWith('image_'))
        );
        const lastIndex = lastImage ? Number(lastImage.id.split('_')) : 0;
    
        newAssetsSample.forEach((_asset, k) => {
            
            assetsPaths.forEach(ap => {
                const randImage = Math.floor(ap.images.length * Math.random());
                const isAnimated = last(ap.images[randImage].split('.')) === 'mov';
        
                if (_asset.id === partsAssetMap[ap.type][isAnimated ? 1 : 0]) {
                    _asset.u = ap.path;
                    _asset.p = ap.images[randImage];
                }
            })
    
            _asset.id = `image_${lastIndex + k}`;
        });
        
        
        // --- ADD IMAGES AND VIDEOS WITH NEW REF ID
        json.assets.push(...newAssetsSample);
    
        const newComposition = clone(compositionSample);
        const compositionId = `comp_${i + 1}`;
    
        newComposition.id = compositionId;
        
        newComposition.layers.forEach((lay, j) => {
            if (lay.refId) {
                const newRefN = +last(lay.refId.split('_')) + j;
                lay.refId = `image_${newRefN}`;
            }
        })
        
        // --- ADD A NEW COMPOSITION
        json.assets.push(newComposition);
        
        const newLayer = clone(layerSample);
        
        let startIndex = 1;
        let startFrame = 0;
        let lastFrame = 28;
        
        const lastLayer = last(json.layers);
        if (lastLayer) {
            startIndex = lastLayer.ind + 1;
            startFrame = lastLayer.ip + 28;
            lastFrame = lastLayer.op + 28;
        }
        
        newLayer.ind = startIndex;
        newLayer.nm = `animation_${i + 1}`;
        
        newLayer.refId = compositionId;
        newLayer.ip = startFrame;
        newLayer.op = lastFrame;
        newLayer.st = lastFrame;
        
        json.layers.push(newLayer);
    }
    
    json.op = json.layers.length * 28;
    
    if (shouldExport) {
        try {
            fs.writeFileSync(`${configs.lottieOutDir}/result.json`, JSON.stringify(json));
        } catch (e) {
            console.error(`Unable to write the file, reason ${e.message}`);
        }
    }
    
    return json;
}
