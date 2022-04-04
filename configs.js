const {cwd} = process;

module.exports = {
    width: 1000,
    height: 1000,
    staticPath: 'images',
    lottieOutDir: cwd() + '/build/lotties',
    metadata: cwd() + '/metadata.json',
};

