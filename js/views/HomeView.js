define([
  'jquery',
  'underscore',
  'backbone',
  'TweenMax'
], function($, _, Backbone, TweenMax){

	var HomeView = Backbone.View.extend({
		active: true,
		interval: 1000,
		blockSize: {
			w: 170,
			h: 200
		},
		blockColors: ['#70ef37', '#34b5ff', '#6431e7', '#ff4800', '#5ccdab', '#852941', '#f8eb32', '#b537ef', '#e731c4', '#028793', '#ff8000', '#2f17e8', '#754d29', '#ef4137'],
		blocksTimer: null,
		id: 'p-home',
		className: 'p-home window',
		events: {},
		initialize: function(){

			var self = this;

			$(window).bind("resize.app", _.bind(this.renderBlocks, this));
			
			$(window).on('focus', function(){
				self.active = true;
			})

			$(window).on('blur', function(){
				self.active = false;
			})

			this.renderBlocks();

		},

		renderBlocks: function(){

			if (this.blocksTimer !== null) clearInterval(this.blocksTimer);

			var self = this,
					ww = $(window).width(),
					wh = $(window).height(),
					side = Math.min(ww, wh),
					posOffsetX = (ww - side)/2,
					posOffsetY = (wh - side)/2,
					imgStart = ww > wh ? (ww - side) / 2 : (wh - side) / 2,
					imgEnd = ww > wh ? (ww - side) / 2 + side : (wh - side) / 2 + side;

			if (this.$blocks) this.$blocks.remove();

			this.$blocks = $('<div></div>').addClass('blocks');
			
			this.cols = Math.round(ww / this.blockSize.w);
			this.rows = Math.round(wh / this.blockSize.h);
			
			this.blockWidth = blockWidth = Math.ceil(ww/this.cols);
			this.blockHeight = blockHeight = Math.ceil(wh/this.rows);

			for (var i = 0; i <= this.cols; i++){
				for (var j = 0; j <= this.rows; j++){

					var left = i * blockWidth,
							top = j * blockHeight,
							bgPosX = false,
							bgPosY = false;

					if (ww > wh){
						if (left + blockWidth >= imgStart && left <= imgEnd){
							bgPosX = imgStart - left;
							bgPosY = -top;
						}
					} else {
						if (top + blockHeight >= imgStart && top <= imgEnd){
							bgPosX = -left;
							bgPosY = imgStart - top;
						}
					}

					var blockCss = {
						width: blockWidth,
						height: blockHeight,
						top: top,
						left: left,
						backgroundColor: self.blockColors[Math.floor(Math.random()*this.blockColors.length)]
					};

					if (bgPosX !== false && bgPosY !== false){
						_.extend(blockCss, {
							'-o-background-size': side+'px '+side+'px',
							'-moz-background-size': side+'px '+side+'px',
							'-webkit-background-size': side+'px '+side+'px',
							'background-size': side+'px '+side+'px',
							backgroundPosition: (bgPosX+'px ')+(bgPosY+'px')
						})
					} else {
						_.extend(blockCss, {
							backgroundImage: 'none'
						})
					}
					
					this.$blocks.append($('<div></div>').addClass('block').css(blockCss).data({
						col: i,
						row: j
					}));

				}
			}

			this.$el.append(this.$blocks);

			this.blocksTimer = setInterval(function(){
				if (!self.active || !self.$el.hasClass('show')) return;
				if (Math.random() > 0.5){
					self.moveCol(Math.floor(Math.random()*self.cols));
				} else {
					self.moveRow(Math.floor(Math.random()*self.rows));
				}
			}, self.interval)

			document.body.appendChild(this.el);

		},

		moveCol: function(col){
			var self = this;

			var dir = (Math.random()>0.5 ? -1 : 1);

			$.each(self.$blocks.find('.block'), function(){

				var $block = $(this)		
				
				if ($block.data('col') === col){

					var current = $block.data('row'),
							next = (current+dir) % (self.rows+1);

					if (next < 0) next = self.rows;
					$block.data('row', next);

					var top = parseInt($block.css('top'), 10);

					if (dir === -1){
						if (top == -self.blockHeight){
							$block.css('top', self.blockHeight * self.rows)
						}
					} else {
						if (top == self.blockHeight * self.rows){
							$block.css('top', '-'+self.blockHeight + 'px')
						}
					}
					
					TweenMax.to($block, .2, {
						top: '+='+ dir*self.blockHeight
					})
					
				}
			})
		},

		moveRow: function(row){
			var self = this;

			var dir = (Math.random()>0.5 ? -1 : 1);

			$.each(self.$blocks.find('.block'), function(){

				var $block = $(this)		
				
				if ($block.data('row') === row){

					var current = $block.data('col'),
							next = (current+dir) % (self.cols+1);

					if (next < 0) next = self.cols;
					$block.data('col', next);

					var left = parseInt($block.css('left'), 10);

					if (dir === -1){
						if (left == -self.blockWidth){
							$block.css('left', self.blockWidth * self.cols)
						}
					} else {
						if (left == self.blockWidth * self.cols){
							$block.css('left', '-'+self.blockWidth + 'px')
						}
					}
					
					TweenMax.to($block, .2, {
						left: '+='+ dir*self.blockWidth
					})
					
				}
			})
		},

	});

	return HomeView;

})