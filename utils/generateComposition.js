const compositionSample = require('../skeletons/compositionSkeleton.json');
const {clone, cloneDeep} = require('lodash');

class Composition {
    constructor(id, layers = []) {
        this.id = id;
        this.layers = layers;
    }
}

const traitToAssetRef = {
    Eyes: {
        refId: 'image_5',
        path: 'Eyes'
    },
    "Left Hand": {
        refId: 'image_8',
        path: 'Hands/Left'
    },
    "Right Hand": {
        refId: 'image_1',
        animationRef: 'image_27',
        path: 'Hands/Right',
    },
    "Hands": {
        refId: "",
        path: "Hands"
    },
    Head: {
        refId: 'image_3',
        path: 'Head',
    },
    Mouth: {
        refId: 'image_4',
        path: 'Mouth',
    },
    Body: {
        refId: 'image_6',
        path: 'Body',
    },
    Shoes: {
        path: "Shoes/Nike",
        animations: [{
            name: 'Left',
            refRange: [9, 17],
            assetPrefix: "image_",
            get nameFormatter() {
                return ' ' + this.name + ' '
            }
        }, {
            name: 'Right',
            refRange: [18, 26],
            assetPrefix: "image_",
            get nameFormatter() {
                return ' ' + this.name + ' '
            }
            
        }],
    }
};

function prepareTraitRefs() {
    // if no animationRef set, then add manually
    Object.values(traitToAssetRef).forEach(val => val.animationRef = val.animationRef || val.refId);
}

prepareTraitRefs();

function generateComposition(assets, metadata) {
    const compositionLayers = cloneDeep(compositionSample);
    
    const updateComposition = (assetId, layerRefId) => {
        const foundAsset = assets.find(a =>
            a.id.toLowerCase() === assetId.replaceAll(' ', '_').toLowerCase()
        );
        if (!foundAsset) {
            return;
        }
        
        // get animation layerIndex
        const inds = [];
        compositionLayers.forEach((l, i) => {
            if (l.refId === layerRefId) inds.push(i);
        })
        
        if (inds.length) {
            inds.forEach(i => compositionLayers[i].refId = foundAsset.id)
            inds.length = 0;
        }
    }
    
    metadata.attributes.forEach(attr => {
        const foundTrait = traitToAssetRef[attr.trait_type];
        if (foundTrait.animations) {
            foundTrait.animations.forEach(animation => {
                const [start, end] = animation.refRange;
                for (let i = start, counter = 1; i <= end; i++, counter++) {
                    const fullIdInAssets = attr.value + animation.nameFormatter + counter;
                    updateComposition(fullIdInAssets, animation.assetPrefix + i);
                }
            });
        } else {
            const foundAsset = assets.find(a =>
                a.id.toLowerCase() === attr.value.replaceAll(' ', '_').toLowerCase()
            );
            if (!foundAsset) {
                return;
            }
            const assetProperty = foundAsset.p.includes('.mov') ? 'animationRef' : 'refId';
            updateComposition(attr.value, foundTrait[assetProperty]);
        }
    });
    return new Composition(`composition_${metadata.name.replaceAll(' ', '_')}`, compositionLayers);
}

module.exports = generateComposition;

/**
 * @TODO
 * 0. Generate animations from all of mov combinations
 * ===========
 * 1. Script for replace the assets whitespaces to _ in folders
 * 2. Just keep the feet filenames same as provided (countin reset for right leg)
 * 4. Skip file extensions, for mov files hashlips
 * 5. Remove Hands if it's none
 *
 */
