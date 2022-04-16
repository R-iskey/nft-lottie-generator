const fs = require('fs-extra');
const {getGeneratedMetadataPath} = require('../utils/directories');
const path = require('path');

function isDuplicate(values) {
    const seen = new Set();
    const indexes = [];
    const duplicated = values.some((currentObject, i) => {
        const duplicated = seen.size === seen.add(currentObject.name).size;
        if (duplicated) {
            indexes.push(i)
        }
        return duplicated;
    });
    
    return {duplicated, indexes};
}

function generateMetadata(metadata) {
    // check duplication
    const {duplicated, indexes} = isDuplicate(metadata);
    if (duplicated) {
        throw new Error(`Duplication found on indexes, ${indexes}`);
    }
    
    const metadataPath = getGeneratedMetadataPath();
    
    // create metadata folder
    fs.mkdirpSync(metadataPath);
    
    metadata.forEach((meta, index) => {
        fs.writeJsonSync(
            path.join(metadataPath, `${index + 1}.json`),
            meta,
            {spaces: 2}
        );
    });
    
    fs.writeJsonSync(
        path.join(metadataPath, 'metadata'),
        metadata,
        {spaces: 2}
    );
}

module.exports = generateMetadata;
