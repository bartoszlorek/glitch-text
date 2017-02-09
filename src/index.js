
require.config({
	paths: {
        aframe: '../external/aframe/src/aframe',
        glitchText: 'glitch-text'
    }
});

require( ['aframe', 'glitchText'], function(aframe, GlitchText) {

    var glitch = new GlitchText('glitch');

    glitch.animate(2, 40, function(progress) {
        // from left to right
        return this.glitchSlice(progress);

        // from left to right and as a thin slice
        return this.glitchSlice(progress, progress+0.25);

        // from right to left
        return this.glitchSlice(-progress);

        // from right to left and as a thin slice
        return this.glitchSlice(-progress-0.25, -progress);

        // from center to edges
        return this.glitchSlice(-progress/2+0.5, progress/2+0.5);

        // from edges to center
        return this.glitchSlice(progress/2, -progress/2);

        // and many more...
    });

    // random tick every 5 seconds
    glitch.repeat(5, function() {
        this.animate(.5, 10, function(progress) {
            if (progress > .5) {
                return this.glitchRandom(1-progress);
            }
        });
    }, 'unique_name');

    // stop ticking after 30 seconds
    aframe.setTimeout(function() {
        glitch.stop('unique_name');
    }, 30 * 1000);

});