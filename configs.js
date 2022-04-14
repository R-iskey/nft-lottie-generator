const {cwd} = process;
const root = cwd();

module.exports = {
    width: 1000,
    height: 1000,
    rootPath: root,
    assetsPath: root + '/images/Floating',
    lottieOutDir: root + '/build/lotties',
    metadataPath: root + '/build/metadata',
    metadata: root + '/metadata.json',
};

// Animated hand 01 - image_0 - Right Hand
// Right hand - image_1 - Right hand
// Body 01 - image_2 - Static right hand
// Left hand - image_8 - Left hand
// Body 02 - image_26 - Static left hand
// Animated hand 02 - image_27 - Left hand

/**
 * 2 hands use Animated hand 01 or Body 01(static) and remove Left hand
 */
