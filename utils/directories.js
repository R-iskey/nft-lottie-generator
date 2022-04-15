const configs = require('../configs');
const path = require('path');

const root = process.cwd();

function getAssetPath() {
    return path.join(root, configs.assetsPath)
}

function getBuildPath() {
    return path.join(root, configs.outDir)
}

function getCopyAssetPath() {
    return path.join(root, configs.outDir, configs.assetsPath)
}

function getGeneratedMetadataPath() {
    return path.join(root, configs.outDir, configs.metadataPath)
}

function getCompositionPath() {
    return path.join(root, configs.outDir, configs.compositionsPath)
}

module.exports = {
    getAssetPath,
    getBuildPath,
    getCopyAssetPath,
    getGeneratedMetadataPath,
    getCompositionPath
}
