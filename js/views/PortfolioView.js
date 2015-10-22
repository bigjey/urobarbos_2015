define([
  'jquery',
  'underscore',
  'backbone',
  'text!../templates/list_item.html'
], function($, _, Backbone, PortfolioListItem){

	var PortfolioView = Backbone.View.extend({
		active: true,
		interval: 2000,
		blockSize: {
			w: 180,
			h: 220
		},
		itemTemplate: _.template(PortfolioListItem),
		blockColors: ['#70ef37', '#34b5ff', '#6431e7', '#ff4800', '#5ccdab', '#852941', '#f8eb32', '#b537ef', '#e731c4', '#028793', '#ff8000', '#2f17e8', '#754d29', '#ef4137'],
		blocksTimer: null,
		
		id: 'p-portfolio',
		className: 'p-portfolio window',

		events: {
      'click a.block': 'loadProject'
    },

		initialize: function(){

      var self = this;

			$(window).bind("resize.app", _.bind(this.renderBlocks, this));
			
			$(window).on('focus', function(){
				self.active = true;
			})

			$(window).on('blur', function(){
				self.active = false;
			})

      this.render();
      this.renderBlocks();

		},

		render: function(){
			document.body.appendChild(this.el);
		},

		renderBlocks: function(){

			var self = this,
					ww = $(window).width(),
					wh = $(window).height();

			if (this.$blocks) this.$blocks.remove();

			this.$blocks = $('<div></div>').addClass('blocks scroll');
			
			this.cols = Math.round(ww / this.blockSize.w);
			this.rows = Math.round(wh / this.blockSize.h);
			
			this.blockWidth = blockWidth = Math.ceil(ww/this.cols);
			this.blockHeight = blockHeight = Math.ceil(wh/this.rows);

      this.$blocks.css({
        width: self.cols * self.blockWidth,
        height: self.rows * self.blockHeight
      })

      this.rows = Math.max(this.rows, Math.ceil(window.projectsCollection.length / self.cols));

      for (var i = 0, len = self.cols * self.rows; i < len; i++){

        var col = i % this.cols,
            row = Math.floor(i / this.cols);

        var left = col * blockWidth,
            top = row * blockHeight;

        var blockCss = {
          width: blockWidth,
          height: blockHeight,
          top: top,
          left: left
        };

        var blockData = {
          col: col,
          row: row
        };

        var project = window.projectsCollection.models[i % window.projectsCollection.length];

        var itemHTML = self.itemTemplate({
          url: project.get('url'),
          title: project.get('title'),
          subtitle: project.get('subtitle'),
          description: project.get('description'),
          bgImage: project.get('preview'),
          bgColor: project.get('bgColor'),
          css: blockCss,
          data: blockData
        });

        this.$blocks.append(itemHTML);

			}

			this.$el.append(this.$blocks);

      if ($('html').hasClass('no-touch')){
        this.$blocks.perfectScrollbar();
      }

		},

    loadProject: function(e){

      if ($(window).width() > 480){
        e.preventDefault();

        var $item = $(e.currentTarget);

        $.each(this.$blocks.find('.block'), function(i, block){
          if ($item.index() != i)
            TweenMax.to(block, 1.5, {y: $(window).height()*2.5, delay: Math.random()});
        })

        setTimeout(function(e){
          window.controller.navigate($item.attr('href'), {trigger: true});
        }, 2000)
      }

    }

	});

	return PortfolioView;

})