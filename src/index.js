
require.config({
	paths: {
		aframe: '../external/aframe/src/aframe',
        glitchText: 'glitch-text'
	}
});

require( ['glitchText'], function(GlitchText) {

    var glitch = new GlitchText('glitch')
        .animateOffset()
        .repeat(10, function() {
            this.animateRandom();
        }, 'unique_task')

    console.log(glitch);

});