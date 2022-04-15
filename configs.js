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
            refId: 'image_25',
            animationRef: 'image_27',
            specialRef: 'image_26',
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
            refId: 'image_28',
            path: "Background"
        },
        Feet: {
            path: "Feet",
            animations: [{
                name: 'Left',
                refRange: [7, 15],
                assetPrefix: "image_",
                get nameFormatter() {
                    return ' ' + this.name + ' '
                }
            }, {
                name: 'Right',
                refRange: [16, 24],
                assetPrefix: "image_",
                get nameFormatter() {
                    return ' ' + this.name + ' '
                }
                
            }],
        }
    }
};
