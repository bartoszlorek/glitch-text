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

        animate: function(duration, steps, callback) {
            if (typeof callback !== 'function') {
                throw 'Animate method needs callback!';
            }
            var progress = 0,
                requestID;

            function updateAnimation() {
                if (progress >= 1) {
                    aframe.clear(requestID);
                    return;
                }
                progress += 1/steps;
                if (progress >= .99) progress = 1;
                this.text(callback.call(this, progress));

                requestID = aframe.setInterval(
                    updateAnimation.bind(this),
                    Math.round(duration * 1000 / steps)
                );
            }
            updateAnimation.call(this);
        },

        repeat: function(frequency, callback) {
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
            }
            iterate();
            return request;
        }/*,


        animateOffset: function(options) {
            options = options || {};
            var duration = options.duration || 2,
                steps = options.steps || 30,
                delay = options.delay || 0;

            this.setText(this.glitchOffset(0));
            requestTimeout(
                this.animate.bind(this, duration, steps, function(progress) {
                    return this.glitchOffset(progress);
                }), delay * 1000
            );
        },

        animateRandom: function(options) {
            options = options || {};
            var duration = options.duration || .5,
                steps = options.steps || 10;

            this.animate.call(this, duration, steps, function(progress) {
                if (progress < .5) return false;
                return this.glitchRandom(1 - progress);
            });
        }*/
    }

    return GlitchText;

});