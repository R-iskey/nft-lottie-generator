const fs = require('fs');

const scanImagesPath = require('./utils/scanImagesPath');
const generateAssets = require('./utils/generateAssets');
const generateComposition = require('./utils/generateComposition');
const generateLayer = require('./utils/generateLayer');

const configs = require('./configs');
const generateLottie = require('./utils/generateLottie');

const metadata = require(configs.metadata);

const CURRENT_PATH = process.cwd();

async function main() {
    const staticPath = CURRENT_PATH + '/' + configs.staticPath;
    const fullAssets = await scanImagesPath(staticPath, ['.png', '.mov']);
    
    const normalizeFilePath = (filePath) => filePath.replace(staticPath + '/', '');
    const assets = generateAssets(fullAssets.map(normalizeFilePath));
    console.log(`--- Assets Generated ---`);
    console.log(`Assets Count: ${assets.length}`);
    
    const compositions = [];
    metadata.forEach(
        meta => compositions.push(generateComposition(assets, meta))
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
