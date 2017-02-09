({
    baseUrl: '../',
    paths: {
        aframe: 'external/aframe/src/aframe',
        glitchText: 'src/glitch-text'
    },
    include: ['tools/almond', 'glitchText'],
    //exclude: ['jquery'],
    out: '../dist/glitch-text.min.js',
    wrap: {
        startFile: 'wrap.start',
        endFile: 'wrap.end'
    }
})
