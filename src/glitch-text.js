/*! Copyright (c) 2017 Bartosz Lorek */

define( ['aframe'], function (aframe) {

    function randomLetter() {
        var letters = '57e5d1a9f98f8b2f6880de32',
            n = Math.floor(Math.random() * letters.length);
        return letters[n];
    }

    function getDeepestChild(element) {
        var children = element.children;
        return children.length > 0
            ? getDeepestChild(children[0])
            : element;
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

        glitchOffset: function(offset) {
            var text = this.originalText;
            if ((offset = offset || 0) >= 1)
                return text;
            return text
                .split('')
                .map(function(letter, index) {
                    if (letter === ' ')
                        return letter;
                    return index/text.length >= offset
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
                remain = Math.round(text.length * percent),
                indexes = [],
                process, position;

            if (remain <= 0) {
                return text;
            }
            while (remain--) {
                process = true;
                while (process) {
                    position = Math.round(Math.random() * text.length);
                    if (indexes.indexOf(position) < 0) {
                        indexes.push(position);
                        process = false;
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

        animate: function(duration, steps, callback, name) {
            if (typeof callback !== 'function') {
                throw 'Animate method needs callback!';
            }
            var time = Math.round(duration * 1000 / steps),
                progress = 0,
                request,

                update = function() {
                    if (progress >= 1) {
                        return false;
                    }
                    progress += 1/steps;
                    if (progress >= .99) {
                        progress = 1;
                    }
                    this.text(callback(progress));
                };

            update = update.bind(this);
            callback = callback.bind(this);
            request = aframe.setInterval(update, time);

            if (typeof name === 'string')
                this.requests[name] = request;
            return this;
        },

        repeat: function(frequency, callback, name) {
            if (typeof callback !== 'function') {
                throw 'Repeat method needs callback!';
            }
            frequency = frequency || 20;
            callback = callback.bind(this);

            var request = {};
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
        },

        animateOffset: function(duration, steps) {
            this.animate(
                duration || 2,
                steps || 30,
                function(progress) {
                    return this.glitchOffset(progress);
                });
            return this;
        },

        animateRandom: function(duration, steps) {
            this.animate(
                duration || .5,
                steps || 10,
                function(progress) {
                    if (progress < .5) return false;
                    return this.glitchRandom(1 - progress);
                });
            return this;
        }
    }

    return GlitchText;

});