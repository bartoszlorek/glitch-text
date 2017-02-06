
require.config({
	paths: {
		aframe: '../external/aframe/src/aframe',
        glitchText: 'glitch-text'
	}
});

require( ['aframe', 'glitchText'], function(aframe, GlitchText) {

    var glitch = new GlitchText('glitch')
        .animateOffset()
        .repeat(5, function() {
            this.animateRandom();
        }, 'unique_name');

    aframe.setTimeout(function() {
        glitch.stop();
        console.log('stop!');
    }, 5000);

    console.log(glitch);

});