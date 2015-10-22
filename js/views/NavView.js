define([
  'jquery',
  'underscore',
  'backbone',
  'text!../templates/nav.html',
  'TweenMax'
], function($, _, Backbone, NavTemplate, TweenMax){

  var NavView = Backbone.View.extend({
    id: 'nav',
    className: 'p-nav window scroll',
    template: _.template(NavTemplate),

    events: {
      'mouseover .projects a': 'itemMouseOver',
      'mouseleave .projects a': 'itemMouseLeave',
      'click': 'hideNav'
    },

    initialize: function(){
      this.render();
    },

    tweens: [],

    render: function(){
      this.$el.html(this.template({}));
      document.body.appendChild(this.el);
    },

    itemMouseOver: function(e){

      var $item = $(e.target),
          id = $item.closest('li').data('img-id'),
          $img = this.$el.find('.logos .img[data-id='+id+']'),
          index = $item.index();

      $img.css({top: -$(window).height()});

      $img.css({
        left: Math.random() * ($(window).width() - $img.width())
      }).show();

      TweenMax.to($img,.5 ,{top: Math.random() * ($(window).height() - $img.height())});

    },

    itemMouseLeave: function(e){

      var $item = $(e.target),
          id = $item.closest('li').data('img-id'),
          $img = this.$el.find('.logos .img[data-id='+id+']'),
          index = $item.index(),
          self = this;

      TweenMax.to($img,.5 ,{top: '+='+($(window).height()*2)})

    },

    hideNav: function(e){
      if ($(e.target).is('.logos')){
        window.appView.hideNav();
      }
    }

  });

  return NavView;

})