define([
  'jquery',
  'underscore',
  'backbone',
  'TweenMax'
], function($, _, Backbone, TweenMax){

	var AppView = Backbone.View.extend({
		el: document.body,
		events: {
			'click .b-nav-trigger': 'showNav',
			'click #nav .i-close': 'hideNav'
		},

    initialize: function(){
      var self = this;
      $(document).on('click', '#like-btn', function(){
        self.like();
      });
    },

		showNav: function(){
      TweenMax.to(window.navView.$el,.90, {
        css: {
          y: '0%'
        },
        ease: Bounce.easeOut
      });
      window.navView.$el.addClass('show')
		},

		hideNav: function(){

      TweenMax.set(window.navView.$el, {
        css: {
          y: '-100%'
        }
      });
      window.navView.$el.removeClass('show');


		},

    like: function(){
      var $likeDiv = $('<div class="like-layer"></div>');
      document.body.appendChild($likeDiv[0]);
      var w = Math.max($(window).height(), $(window).width());

      $.get('/site/like', function(response){
        $('#likes-count').html(response);
      });

      (function(img){
        TweenMax.to(img,.5, {
          width: w*2,
          height: w*2,
          opacity:.6,
          ease: Expo.easeIn,
          onComplete: function(){
            img.fadeOut(function(){
              img.remove();
            })
          }
        })
      })($likeDiv);
    }

	});

	return AppView;

})