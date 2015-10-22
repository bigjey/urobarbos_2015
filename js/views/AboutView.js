define([
  'jquery',
  'underscore',
  'backbone',
  'text!../templates/about.html'
], function($, _, Backbone, AboutTemplate){

	var AboutView = Backbone.View.extend({
		id: 'p-about',
		className: 'p-about window scroll',
		template: _.template(AboutTemplate),
		interval: 5000,
		bgColors: [
			'#fe0000',
			'#ff8800',
			'#fbda00',
			'#8cd71b',
			'#31cbc1',
			'#6364fd',
			'#d846d5',
		],
		activeColor: null,
		initialize: function(){

			var self = this;

			self.render();

			self.setColor();

			setInterval(function(){
				self.setColor();
			}, self.interval);
			
		},

		render: function(){
			this.$el.html(this.template({}));
			document.body.appendChild(this.el);
		},

		setColor: function(){

      if (!this.$el.hasClass('show')) return;

			var self = this;

			if (self.activeColor == null){
				self.activeColor = self.getRandomColor();
			} else {
				var color = self.getRandomColor();
				while(color == self.activeColor) color = self.getRandomColor();
				self.activeColor = color;
			}

			self.$el.css('background-color', self.activeColor);

		},

		getRandomColor: function(){
			var self = this;
			return self.bgColors[Math.floor(Math.random()*self.bgColors.length)];
		}

	});

	return AboutView;

})