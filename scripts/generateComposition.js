const compositionSample = require('../skeletons/compositionSkeleton.json');
const {cloneDeep} = require('lodash');
const {getCompositionPath} = require('../utils/directories');
const fs = require('fs-extra');
const path = require('path');
const {traitToAssetRef} = require('../configs');

class Composition {
    constructor(id, layers = []) {
        this.id = id;
        this.layers = layers;
    }
}

function generateComposition(assets, metadata, num) {
    const compositionLayers = cloneDeep(compositionSample);
    const specialHandAttributes = ['Pentagram', 'Flowers', 'Cooler', 'Super Soaker', 'Briefcase', 'Hockey Stick', 'Ghost Pup', 'Vampire Hunter Crucifix'];
    
    // if no animationRef set, then add manually
    Object.values(traitToAssetRef).forEach(val => val.animationRef = val.animationRef || val.refId);
    
    const updateComposition = (assetId, layerRefId) => {
        const foundAsset = assets.find(a =>
            a.id.toLowerCase() === assetId.replaceAll(' ', '_').replaceAll('-', '_').toLowerCase()
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
            console.warn(`**Unable to find the trait "${attr.trait_type}" in traits mapping`)
            return;
        }
        
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
                a.id.toLowerCase() === attr.value.replaceAll(' ', '_').replaceAll('-', '_').toLowerCase()
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
    
    const compositionPath = getCompositionPath();
    const compName = `comp_${metadata.name.replaceAll(' ', '_')}_${num}`;
    
    const newComposition = new Composition(compName, compositionLayers);
    
    // create metadata folder
    fs.mkdirpSync(compositionPath);
    
    fs.writeJsonSync(
        path.join(compositionPath, `${compName}.json`),
        newComposition,
        {spaces: 2}
    );
    
    return newComposition;
}

module.exports = generateComposition;
