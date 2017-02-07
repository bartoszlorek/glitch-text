# Glitch Text

## Usage
Low-level methods return element's glitched textContent.

```
.glitchOffset( offset ) // from offset (as percent) to the end of string
.glitchRandom( percent ) // random chars in given amount
```

Call callback `steps` times in `duration` (seconds) with `progress` as an argument. Unique `name` of task is used to stop single method.

```
.animate( duration, steps, callback[, name] )
```

Facade methods combining `animate` with low-levels.

```
.animateOffset( duration, steps ) // defaults: 2, 30
.animateRandom( duration, steps ) // defaults: .5, 10
```

Similar to setInterval but `frequency` is a random (changes every call) amount of time between 0 and given value.

```
.repeat( frequency, callback[, name] )
```

Clear animation set with the methods above. Stop all when `name` is undefined.

```
.stop( [name] )
```

## Examples

```javascript
require( ['glitchText'], function(glitchText) { ... })
```

Animate heading from whole to none glitched at the end of string. Then call random glitch in intervals between 0 and 5 seconds. Finally after 20 seconds stop repetitions uniquely named.

```javascript
// <h1 id="glitch">Heading</h1>

var glitch = new GlitchText('glitch')
    .animateOffset(2, 30)
    .repeat(5, function() {
        this.animateRandom(.5, 10);
    }, 'unique_name');

setTimeout(function() {
    glitch.stop('unique_name');
}, 20 * 1000);
```
