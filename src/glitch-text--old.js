
define( ['aframe'], function (aframe) {

    function getArgument(args, type, index, failure) {
        var value, temp;

        if (typeof type !== 'string' && type !== '') {
            throw 'getArgument function needs type!';
        }
        if (typeof index === 'number') {
            temp = index < 0
                ? args[args.length + index]
                : args[index];
            if (typeof temp === type)
                value = temp;

        } else if (index.constructor === Array) {
            temp = args
                .slice(index)
                .filter(function(arg) {
                    return typeof arg === type;
                });
            if (temp.length > 0)
                value = temp[0];

        } else throw 'getArgument function needs index!';
        return typeof value === 'undefined'
            ? failure
            : value;
    }

    function getDeepestChild(element) {
        var children = element.children;
        return children.length > 0
            ? getDeepestChild(children[0])
            : element;
    }

    function clampNumber(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function randomLetter() {
        var letters = '57e5d1a9f98f8b2f6880de32',
            n = Math.floor(Math.random() * letters.length);
        return letters[n];
    }

    function GlitchText(elementID) {
        this.element = document.getElementById(elementID);
        this.originalText = this.text();
        this.requests = {};
        return this;
    }

    GlitchText.prototype = {
        text: function(value) {
            var inner = getDeepestChild(this.element);
            if (! (inner.nodeType === 1
                || inner.nodeType === 11
                || inner.nodeType === 9)
                ) return "";
            return typeof value === 'string'
                ? inner.textContent = value
                : inner.textContent;
        },

        glitchSlice: function(start, end) {
            start = (start = parseFloat(start)) || 0;
            end = (end = parseFloat(end)) || 1;
            if (start < 0) start = 1 + start;
            if (end < 0) end = 1 + end;
            start = clampNumber(start, 0, 1);
            end = clampNumber(end, 0, 1);

            var text = this.originalText;
            if (start === 1 || start > end)
                return text;

            return text
                .split('')
                .map(function(letter, index) {
                    if (letter === ' ')
                        return letter;
                    var percent = index/text.length;
                    if (percent >= .99) {
                        percent = 1;
                    }
                    return percent >= start
                        && percent <= end
                        && start !== end
                        ? randomLetter()
                        : letter;
                })
                .join('');
        },

        glitchRandom: function(percent) {
            if ((percent = percent || 0) < 0) {
                percent = 0;
            }
            var text = this.originalText,
                requiredAmount = Math.round(text.length * percent),
                uniqueIndex,
                indexes = [],
                index;

            if (requiredAmount <= 0) {
                return text;
            }
            while (requiredAmount--) {
                uniqueIndex = false;
                
                while (! uniqueIndex) {
                    index = Math.round(Math.random() * text.length);
                    if (indexes.indexOf(index) < 0) {
                        indexes.push(index);
                        uniqueIndex = true;
                    }
                }
            }
            return text.split('')
                .map(function(letter, index) {
                    if (letter === ' ')
                        return letter;
                    return indexes.indexOf(index) > -1
                        ? randomLetter()
                        : letter;
                })
                .join('');
        },

        // [duration, steps, ]callback[, name]
        animate: function() {
            var args = Array.prototype.slice.call(arguments),
                duration = getArgument(args, 'number', 0, 1),
                steps = getArgument(args, 'number', 1, 20),
                callback = getArgument(args, 'function', [-2], false),
                name = getArgument(args, 'string', [-1], false),
                progress = 0,
                request;

            if (typeof callback !== 'function') {
                throw 'Animate method needs callback!';
            }
            var update = function() {
                if (progress >= 1) {
                    return false;
                }
                progress += 1/steps;
                if (progress >= .99) {
                    progress = 1;
                }
                var newText = callback(progress);
                if (typeof newText === 'string')
                    this.text(newText);
            };

            update = update.bind(this);
            callback = callback.bind(this);
            request = aframe.setInterval(update,
                Math.round(duration * 1000 / steps));

            if (typeof name === 'string')
                this.requests[name] = request;
            return this;
        },

        // [frequency, ]callback[, name]
        repeat: function() {
            var args = Array.prototype.slice.call(arguments),
                frequency = getArgument(args, 'number', 0, 20),
                callback = getArgument(args, 'function', [-2], false),
                name = getArgument(args, 'string', [-1], false),
                request = {};

            if (typeof callback !== 'function') {
                throw 'Repeat method needs callback!';
            }
            callback = callback.bind(this);
            function iterate() {
                request.id = aframe.setTimeout(function() {
                    callback();
                    iterate();
                }, frequency * 1000 * Math.random());
            } iterate();

            if (typeof name === 'string')
                this.requests[name] = request;
            return this;
        },

        stop: function(name) {
            if (typeof name === 'string') {
                for (var prop in this.requests) {
                    if (prop === name) {
                        aframe.clear(this.requests[prop]);
                        delete this.requests[prop];
                        break;
                    }
                }  
            } else {
                for (var prop in this.requests)
                    aframe.clear(this.requests[prop]);
                this.requests = [];
            }
            return this;
        }
    }

    return GlitchText;

});