# aframe
Request Animation Frame Utilities AMD. Includes polyfill by Erik Möller (fixes from Paul Irish and Tino Zijdel).

## Usage
Methods similar to native JavaScript functions.

```
.setTimeout( function[, delay, param1, param2, ...] )
.setInterval( function[, delay, param1, param2, ...] )
```

Chain multiple `setTimeout` methods (behaving like a promise) in a `waitTime` form.

```
.waitTime( [delay, param1, param2, ..., ]function )
```

Call a functions after/in period measured in `frames`, not milliseconds like methods above.

```
.setFrameout( function[, frames, param1, param2, ...] )
.setFrameval( function[, frames, param1, param2, ...] )
.waitFrame( [frames, param1, param2, ..., ]function )
```

Clear a request set with the methods above. The `request` is a return of them.

```
.clear( request )
```

## Examples

```javascript
require( ['aframe'], function(af) { ... })
```

Clear `request` after timeout.

```javascript
var request = af.setInterval(function() {
    console.log('fire!');
}, 100);

af.setTimeout(function() {
    af.clear(request);
}, 1000);
```

Return `false` in callback function to clear.

```javascript
var counter = 0;
af.setInterval(function() {
    counter++;
    if (counter > 10) {
        return false;
    }
}, 100);
```

The third callback in this example won't be executed.

```javascript
var request = af.waitTime(300, function() {
    console.log('Hello');

}).waitTime(100, ['cats', 'dogs'], function(pets) {
    console.log('I like ' + pets.join(' and '));

}).waitTime('John', function(name) {
    console.log(name + ' is fast, but not enough!');
});

af.setTimeout(function() {
    af.clear(request);
}, 400);
```
