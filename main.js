const fs = require('fs-extra')

const scanImagesPath = require('./utils/scanImagesPath');
const generateAssets = require('./scripts/generateAssets');
const generateComposition = require('./scripts/generateComposition');
const generateLayer = require('./scripts/generateLayer');

const configs = require('./configs');
const generateLottie = require('./scripts/generateLottie');

const generateMetadata = require('./scripts/generateMetadata');
const {getAssetPath, getGeneratedMetadataPath, getBuildPath} = require('./utils/directories');

const filterConditionalAttributes = (meta) => {
    const {attributes} = meta;
    
    const leftIndex = attributes.findIndex(a => a.trait_type === 'Left Hand');
    const rightIndex = attributes.findIndex(a => a.trait_type === 'Right Hand');
    const headIndex = attributes.findIndex(a => a.trait_type === 'Head');
    
    let handsModified = false;
    
    attributes.forEach(({trait_type, value}) => {
        if (trait_type === 'Hands' && value !== 'None') {
            // remove left and right hands if 2 hands provided
            attributes[leftIndex].value = 'None';
            attributes[rightIndex].value = 'None';
            console.log(`Found Both hands -- Reset the left and right hand, Metadata Edition: ${meta.edition} --`);
        } else if (value.search('Boxing') > -1 && !handsModified) {
            // replace right and left hand if boxing or free hand provided in one of them
            attributes[leftIndex].value = value + ' Left';
            attributes[rightIndex].value = value + ' Right';
            handsModified = true;
            console.log(`Found Boxing hands -- Set the left and right hand as ${value}, Metadata Edition: ${meta.edition} --`);
        } else if (value.search('Landline') > -1) {
            // remove head attribute if it's Leadline or Plain Head
            attributes[headIndex].value = 'Plain Head';
            console.log(`Found Landline -- Reset Head attribute, Metadata Edition: ${meta.edition} --`);
        }
    });
    
    return meta;
};

const cleanupFolders = () => {
    fs.emptyDirSync(getBuildPath());
};

const requireSourceMetadata = () => {
    const metadata = require(configs.sourceMetadata);
    if (!Array.isArray(metadata)) {
        throw new Error('Please provide the combined metadata');
    }
    return metadata;
}

async function main() {
    cleanupFolders();
    console.log('--- Clean build folder ---')
    
    // require source metadata
    const metadata = requireSourceMetadata();
    console.log(`--- Source metadata loaded, overall items found: ${metadata.length} ---`);
    
    const fullAssets = await scanImagesPath(getAssetPath(), ['.png', '.mov']);
    
    const normalizeFilePath = (filePath) => filePath.replace(getAssetPath() + '/', '');
    const assets = generateAssets(fullAssets.map(normalizeFilePath));
    console.log(`--- Assets Generated ---`);
    console.log(`Assets Count: ${assets.length}`);
    
    console.log(`--- Filter conditional attributes, find duplicates in metadata ---`);
    const cleanMetadata = metadata.map(filterConditionalAttributes);
    
    generateMetadata(cleanMetadata);
    console.log(`--- New clean metadata created in ${getGeneratedMetadataPath()} ---`);
    
    const compositions = [];
    cleanMetadata.forEach(
        (meta, index) => compositions.push(generateComposition(assets, meta, index + 1))
    );
    
    const layers = compositions.map(generateLayer);
    console.log(`--- Layers Created ---`);
    console.log(`Layers Count: ${layers.length}`);
    
    generateLottie(layers, [...assets, ...compositions]);
    console.log(`--- Lottie File Created ---`);
    console.log(`File: ${configs.outDir}/result.json`)
}

main();
