# Glitch Text

[demo](http://bartoszlorek.pl/run/glitch-text/)

## Constructor
```javascript
import glitchText from 'glitch-text'

const charset = '8sd8gGHsDKh*&d' // optional
const glitch = glitchText(element, charset)
```

## Methods

### slice
```javascript
.slice(start, end)  // start, end: [Number] 0-1
```
Set random characters between start and end position. Similar to the native Array slice but instead of indices use percents. This method changes text content of given element.

### random
```javascript
.random(percent)    // percent: [Number] 0-1
```
Set random characters in given percentage amount. This method changes text content of given element.

### restore
```javascript
.restore()
```
Restore initial text. This method changes text content of given element.

### update
```javascript
.update()
```
Set current text content of given element as a initial text.

## Static Methods

### animate
```javascript
.animate(duration, steps, callback)
```
Method similar to the `setTimeout` but call the function `steps` times in `duration` time. The `callback` function is invoked with arguments: `progress` which is a number from 0 to 1. Method returns the `request` object.

### repeat
```javascript
.repeat(freq, variation, callback)
```
Method similar to the `setInterval` but calls each iteration function after random `variation` time. Final delay time is calculated as `delay + random(+/-variation)`. Method returns the `request` object.

### stop
```javascript
.stop()
```
Clear a request animation frame of methods above.

## Examples

Animate heading in multiple ways.

```javascript
// <h1 id="glitch">Heading</h1>

import glitchText, { animate } from 'glitch-text'

const element = document.querySelector('glitch')
const glitch = glitchText(element)

animate(2, 40, progress => {
    // from left to right
    return glitch.slice(progress)

    // from left to right and as a thin slice
    return glitch.slice(progress, progress+0.25)

    // from right to left
    return glitch.slice(-progress)
    
    // from right to left and as a thin slice
    return glitch.slice(-progress-0.25, -progress)

    // from center to edges
    return glitch.slice(-progress/2+0.5, progress/2+0.5)

    // from edges to center
    return glitch.slice(progress/2, -progress/2)

    // and many more...
})
```

Glitch 50% of chars randomly every 2 seconds (+/- 0.5) and stop after 30 seconds.

```javascript
import { repeat, stop } from 'glitch-text'

const request = repeat(2000, 500, () => {
    animate(500, 10, progress => {
        if (progress > 0.5) {
            glitch.random(1 - progress)
        }
    })
})

setTimeout(() {
    stop(request)
}, 30 * 1000)
```
