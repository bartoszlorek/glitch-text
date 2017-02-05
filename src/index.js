
require.config({
	paths: {
		aframe: '../external/aframe/src/aframe',
        glitchText: 'glitch-text'
	}
});

require( ['glitchText'], function(GlitchText) {

    var glitch = new GlitchText('glitch');




    /*this.animate(2, 10, function(progress) {
        return this.glitchRandom(progress);
    });*/


    var request = glitch.repeat(10, function() {
        console.log(request.id);
    });

    aframe.setTimeout(function() {
        aframe.clear(request);
        console.log('clear', request.id);
    }, 10000);






    //glitch

});