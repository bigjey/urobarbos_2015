define([
  'jquery',
  'underscore',
  'backbone',
  'sly',
  'TweenMax',
  'views/AppView',
  'views/HomeView',
  'views/AboutView',
  'views/PortfolioView',
  'collections/ProjectsCollection',
  'views/ProjectView',
  'views/NavView',
  'views/GameView',
], function($, _, Backbone, Sly, TweenMax, AppView, HomeView, AboutView, PortfolioView, ProjectsCollection, ProjectView, NavView, GameView){

  var Controller = Backbone.Router.extend({

    routes: {
      '': 'home',
      'home': 'home',
      'about': 'about',
      'portfolio': 'portfolio',
      'game': 'game',
      'project/:id': 'project'
    },
    home: function(){



      $('body').addClass('home-page');

      $('.window.hide').removeClass('hide');
      $('.window.show').addClass('hide').removeClass('show');

      window.homeView.$el.addClass('show');

    },
    about: function(){



      $('.window.hide').removeClass('hide');
      $('.window.show').addClass('hide').removeClass('show');

      window.aboutView.$el.addClass('show');

    },
    game: function(){



      $('.window.hide').removeClass('hide');
      $('.window.show').addClass('hide').removeClass('show');

      window.gameView.$el.addClass('show');

    },
    portfolio: function(){



      $('.window.hide').removeClass('hide');
      $('.window.show').addClass('hide').removeClass('show');

      TweenMax.to(window.portfolioView.$el.find('.block'), 0, {y: 0});

      window.portfolioView.$el.addClass('show');

    },
    project: function(id){

      $('body').removeClass('ui-white');


      if (window.currentProjectView) window.prevProjectView = window.currentProjectView;
      window.currentProjectView = new ProjectView({model: window.projectsCollection.get(id)});

      window.currentProjectView.render();

      setTimeout(function(){
        $('.window.hide').removeClass('hide');
        $('.window.show').addClass('hide').removeClass('show');
        setTimeout(function(){
          if (window.prevProjectView) window.prevProjectView.hardRemove();
        }, 1000)
        window.currentProjectView.$el.addClass('show');
      }, 10)

    }
  });

  $.post(lang+'/settings', function(response){

    window.siteSettings = $.parseJSON(response);

    window.projectsCollection = new ProjectsCollection();
    window.projectsCollection.fetch({reset: true})

    window.projectsCollection.once('sync', function(){

      window.navView = new NavView;

      window.appView = new AppView;
      window.homeView = new HomeView;
      window.aboutView = new AboutView;
      window.gameView = new GameView;
      window.portfolioView = new PortfolioView;

      window.controller = new Controller;

      window.controller.on('route', function(route){

        setTimeout(function(){
          $('.window.hide').removeClass('hide');
        }, 600)

        window.appView.hideNav();

        if (route == 'home')
          $('body').addClass('home-page');
        else {
          $('body').removeClass('home-page');
        }

        if (route != 'project'){
          $('body').removeClass('ui-white');
        }

      })

      Backbone.history.start();

       $('.no-touch .scroll').perfectScrollbar();

    });

  })


});