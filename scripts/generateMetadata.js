const fs = require('fs');
const {metadataPath} = require('../configs');

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
    
    // remove metadata folder
    fs.rmSync(metadataPath, { recursive: true, force: true });
    // create again
    fs.mkdirSync(metadataPath);
    
    metadata.forEach((meta, index) => {
        fs.writeFileSync(
            `${metadataPath}/${index + 1}.json`,
            JSON.stringify(meta, null, 2)
        );
    });
    
    fs.writeFileSync(
        `${metadataPath}/metadata.json`,
        JSON.stringify(metadata, null, 2)
    );
}

module.exports = generateMetadata;
