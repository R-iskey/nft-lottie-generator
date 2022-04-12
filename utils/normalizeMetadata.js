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

function normalizeMetadata(metadata, attributesMapper) {
    const output = [];
    
    metadata.forEach((meta, index) => {
        const ln = output.push(meta);
        output[ln - 1].attributes = attributesMapper(output[ln - 1].attributes, index)
    });
    
    const {duplicated, indexes} = isDuplicate(output);
    if (duplicated) {
        throw new Error(`Duplication found on indexes, ${indexes}`);
    }
    
    return output;
}

module.exports = normalizeMetadata;
