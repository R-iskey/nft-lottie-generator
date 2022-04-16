module.exports = {
    width: 1000,
    height: 1000,
    outDir: '/build',
    assetsPath: '/images',
    metadataPath: '/metadata',
    compositionsPath: '/compositions',
    sourceMetadata: './metadata.json',
    traitToAssetRef: {
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
    }
};
