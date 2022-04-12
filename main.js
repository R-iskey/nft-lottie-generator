const fs = require('fs');

const scanImagesPath = require('./utils/scanImagesPath');
const generateAssets = require('./utils/generateAssets');
const generateComposition = require('./utils/generateComposition');
const generateLayer = require('./utils/generateLayer');

const configs = require('./configs');
const generateLottie = require('./utils/generateLottie');

const metadata = require(configs.metadata);
const normalizeMetadata = require('./utils/normalizeMetadata');

const CURRENT_PATH = process.cwd();

const cleanAttributes = (attributes, metadataIndex) => {
    const leftIndex = attributes.findIndex(a => a.trait_type === 'Left Hand');
    const rightIndex = attributes.findIndex(a => a.trait_type === 'Right Hand');
    const headIndex = attributes.findIndex(a => a.trait_type === 'Head');
    
    let boxingHandApplied = false;
    
    attributes.forEach(({trait_type, value}) => {
        if (trait_type === 'Hands' && value !== 'None') {
            attributes[leftIndex].value = 'None';
            attributes[rightIndex].value = 'None';
            console.log(`Found Both hands -- Reset the left and right hand, Metadata N: ${metadataIndex} --`);
        } else if (value.search('Boxing') > -1 && !boxingHandApplied) {
            attributes[leftIndex].value = value + ' Left';
            attributes[rightIndex].value = value + ' Right';
            boxingHandApplied = true;
            console.log(`Found Boxing hands -- Set the left and right hand as ${value}, Metadata N: ${metadataIndex} --`);
        } else if (value.search('Landline') > -1) {
            attributes[headIndex].value = 'None';
            console.log(`Found Landline -- Reset Head attribute, Metadata N: ${metadataIndex} --`);
        }
    });
    
    return attributes;
};


async function main() {
    const staticPath = CURRENT_PATH + '/' + configs.staticPath;
    const fullAssets = await scanImagesPath(staticPath, ['.png', '.mov']);
    
    const normalizeFilePath = (filePath) => filePath.replace(staticPath + '/', '');
    const assets = generateAssets(fullAssets.map(normalizeFilePath));
    console.log(`--- Assets Generated ---`);
    console.log(`Assets Count: ${assets.length}`);
    
    console.log(`--- Config the traits, find duplicates in metadata ---`);
    const cleanMetadata = normalizeMetadata(metadata, cleanAttributes);
    
    const compositions = [];
    cleanMetadata.forEach(
        (meta, index) => compositions.push(generateComposition(assets, meta, index + 1))
    );
    
    const layers = compositions.map(generateLayer);
    console.log(`--- Layers Created ---`);
    console.log(`Layers Count: ${layers.length}`);
    
    const lottie = generateLottie(layers, [...assets, ...compositions]);
    
    fs.writeFileSync(`${configs.lottieOutDir}/result.json`, JSON.stringify(lottie));
    
    console.log(`--- Lottie File Created ---`);
    console.log(`File: ${configs.lottieOutDir}/result.json`)
}

main();
