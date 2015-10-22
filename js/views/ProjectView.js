define([
  'jquery',
  'underscore',
  'backbone',
  'text!../templates/project.html',
  'hammer',
  'mousewheel'
], function($, _, Backbone, ProjectTemplate, Hammer){

  var ProjectView = Backbone.View.extend({

    className: 'p-project window first-slide',
    template: _.template(ProjectTemplate),
    sly: null,
    activeSlide: 0,
    canScroll: true,
    events: {
      'click .pages a': 'toPage',
      'click .prev': 'prevSlide',
      'click .next': 'nextSlide'
    },
    initialize: function(){

    },
    render: function(){

      var self = this;

      this.$el.html(this.template(this.model.toJSON()));
      document.body.appendChild(this.el);

      if (this.model.get('interfaceColor') == '#ffffff') $('body').addClass('ui-white');

      if ($('html').hasClass('touch')){
        var hammertime = new Hammer(self.el);
        hammertime.on('swipeleft', function(e) {
          e.preventDefault();
          self.nextSlide();
        });
        hammertime.on('swiperight', function(e) {
          e.preventDefault();
          self.prevSlide();
        });
      } else {
        this.$el.on('mousewheel', function(e){
          if (!self.canScroll) return;
          self.canScroll = false;
          if (e.deltaY > 0){
            self.prevSlide();
          } else if (e.deltaY < 0){
            self.nextSlide();
          };
          setTimeout(function(){
            self.canScroll = true;
          }, 1100)
        });
      }

      try{
        /*twttr.widgets.createShareButton(
          encodeURIComponent(window.location.href),
          self.$el.find('.twitter-share-button').get(0),
          {
            counturl: encodeURIComponent(window.location.href)
          }
        );*/
        twttr.widgets.load();
      }catch(ex){}

      try{
        FB.XFBML.parse();
      }catch(ex){}

      try {
        self.$el.find('.vk-share').html(VK.Share.button(encodeURIComponent(location.href) ,{type: "button", text: window.siteSettings.labels.share}));
      } catch(ex){}


    },

    prevSlide: function() {
      if (this.activeSlide == 0) {
        var index = window.projectsCollection.indexOf(this.model);
        var next = window.projectsCollection.at(index - 1);
        window.controller.navigate('project/' + next.id, {trigger: true});
      } else {
        this.activeSlide--;
        this.$el.find('.slide.active').removeClass('active');
        this.$el.find('.slide').eq(this.activeSlide).addClass('active');
      }
      this.$el.find('.pages a').removeClass('active');
      this.$el.find('.pages a').eq(this.activeSlide).addClass('active');

      if (this.activeSlide == 0){
        this.$el.addClass('first-slide');
      } else {
        this.$el.removeClass('first-slide');
      }

    },

    nextSlide: function(){
      if (this.activeSlide == this.$el.find('.slide').length - 1){
        var index = window.projectsCollection.indexOf(this.model);
        var next = window.projectsCollection.at((index + 1) % window.projectsCollection.length);
        window.controller.navigate('project/'+next.id, {trigger: true});
      } else {
        this.activeSlide++;
        this.$el.find('.slide.active').removeClass('active');
        this.$el.find('.slide').eq(this.activeSlide).addClass('active');
      }
      this.$el.find('.pages a').removeClass('active');
      this.$el.find('.pages a').eq(this.activeSlide).addClass('active');

      if (this.activeSlide == 0){
        this.$el.addClass('first-slide');
      } else {
        this.$el.removeClass('first-slide');
      }
    },

    toPage: function(e){

      this.activeSlide = $(e.currentTarget).data('page');

      this.$el.find('.slide.active').removeClass('active');
      this.$el.find('.slide').eq(this.activeSlide).addClass('active');

      this.$el.find('.pages a').removeClass('active');
      this.$el.find('.pages a').eq(this.activeSlide).addClass('active');

      if (this.activeSlide == 0){
        this.$el.addClass('first-slide');
      } else {
        this.$el.removeClass('first-slide');
      }

    },

    hardRemove: function(){
      this.unbind();
      this.remove();
    }


  });

  return ProjectView;

})