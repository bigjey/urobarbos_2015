// Filename: main.js

// Require.js allows us to configure shortcut alias
// There usage will become more apparent further along in the tutorial.
require.config({
	shim: {
		jquery: {
			exports: 'jQuery'
		},
		perfectScrollbar: {
      'deps': ['jquery'],
      'exports': 'PerfectScrollbar'
    },
    sly: {
      'deps': ['jquery'],
      'exports': 'Sly'
    },
    hammer: {
      deps: ['jquery'],
      exports: 'Hammer'
    },
    mousewheel: {
      deps: ['jquery']
    }
	},
  paths: {
    jquery: '../bower_components/jquery/dist/jquery.min',
    underscore: '../bower_components/underscore/underscore-min',
    backbone: '../bower_components/backbone/backbone-min',
    perfectScrollbar: '../bower_components/perfect-scrollbar/js/perfect-scrollbar.jquery',
    TweenMax: '../bower_components/gsap/src/minified/TweenMax.min',
    text: '../bower_components/text/text',
    sly: '../bower_components/sly/dist/sly.min',
    swipe: '../bower_components/jquery-touchswipe/jquery.touchSwipe.min',
    hammer: '../bower_components/hammerjs/hammer.min',
    mousewheel: '../bower_components/jquery-mousewheel/jquery.mousewheel.min'
  }
});

require([
	'jquery',
	'perfectScrollbar',
  'backbone',
  'controller'
], function($, perfectScrollbar, Backbone, Controller){

  (function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
      window.cancelAnimationFrame =
        window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback, element) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback() },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };

    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
  }());

});

function calculateGameSpeeds(width, height, playerWidth){
  var speed = height / (20*60);
  var interval = playerWidth * 3;
  return {speed: speed, interval: interval};
};