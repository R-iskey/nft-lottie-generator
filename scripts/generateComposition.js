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
        refId: 'image_9',
        animationRef: 'image_11',
        specialRef: 'image_10',
        path: 'Hand Attributes/Left Hand'
    },
    "Right Hand": {
        refId: 'image_1',
        animationRef: 'image_0',
        specialRef: 'image_2',
        path: 'Hand Attributes/Right Hand',
    },
    "Hands": {
        refId: "image_0",
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
    Background: {
        refId: 'image_12',
        path: "Background"
    },
    Feet: {
        path: "Feet",
        animations: [{
            name: 'Left',
            refRange: [7, 7],
            assetPrefix: "image_",
            get nameFormatter() {
                return ' ' + this.name
            }
        }, {
            name: 'Right',
            refRange: [8, 8],
            assetPrefix: "image_",
            get nameFormatter() {
                return ' ' + this.name
            }
            
        }],
    }
};

function generateComposition(assets, metadata, num) {
    const compositionLayers = cloneDeep(compositionSample);
    const specialHandAttributes = ['Pentagram', 'Flowers', 'Cooler', 'Super Soaker', 'Briefcase', 'Hockey Stick', 'Ghost Pup', 'Vampire Hunter Crucifix'];
    
    // if no animationRef set, then add manually
    Object.values(traitToAssetRef).forEach(val => val.animationRef = val.animationRef || val.refId);
    
    const updateComposition = (assetId, layerRefId) => {
        const foundAsset = assets.find(a =>
            a.id.toLowerCase() === assetId.toLowerCase().replaceAll(' ', '_').replaceAll('-', '_')
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
        if (!foundTrait) {
            console.log('Cant found trait attribute for ', attr.trait_type, attr.trait_value);
            return;
        }
        
        if (foundTrait.animations) {
            foundTrait.animations.forEach(animation => {
                const [start, end] = animation.refRange;
                for (let i = start; i <= end; i++) {
                    const fullIdInAssets = attr.value + animation.nameFormatter;
                    updateComposition(fullIdInAssets, animation.assetPrefix + i);
                }
            });
        } else {
            const foundAsset = assets.find(a =>
                a.id.toLowerCase() === attr.value.toLowerCase().replaceAll(' ', '_').replaceAll('-', '_')
            );
            if (!foundAsset) {
                return;
            }
            
            const specialCase = specialHandAttributes
                .find(hand => (new RegExp(hand, 'gi')).test(attr.value));
            
            const assetProperty = specialCase ? 'specialRef'
                : foundAsset.p.includes('.mov')
                    ? 'animationRef'
                    : 'refId';
            
            updateComposition(attr.value, foundTrait[assetProperty]);
        }
    });
    
    return new Composition(`composition_${metadata.name.replaceAll(' ', '_')}_${num}`, compositionLayers);
}

module.exports = generateComposition;
