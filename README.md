# Glitch Text
Includes https://github.com/ubery/aframe

## Usage
Low-level methods return element's glitched textContent.

```
.glitchSlice( [start, end] ) // similar to native Array slice method, but in percentage (0-1)
.glitchRandom( percent ) // random chars in given amount
```

Call callback `steps` times in `duration` (seconds) with `progress` as a callback's argument. Unique `name` of task is used to stop single method. Note: callback returning `string` sets new text.

```
.animate( [duration, steps, ]callback[, name] ) // default: 1s, 20s
```

Similar to setInterval but `frequency` is a random (changes every call) amount of time between 0 and given value.

```
.repeat( [frequency, ]callback[, name] ) // default: 20s
```

Clear animation set with the methods above. Stop all when `name` is undefined.

```
.stop( [name] )
```

## Examples

```javascript
require( ['glitchText'], function(glitchText) { ... })
```

Animate heading in alternative ways. Then call random tick in intervals between 0 and 5 seconds. Finally after 30 seconds stop repetitions uniquely named.

```javascript
// <h1 id="glitch">Heading</h1>

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
```
