define([
'jquery',
  'underscore',
  'backbone',
  'text!../templates/game.html',
  'TweenMax',
  'hammer'
], function($, _, Backbone, GameTemplate, TweenMax, Hammer){

  var GameView = Backbone.View.extend({
    id: 'p-game',
    template: _.template(GameTemplate),

    canvas: null,
    ctx: null,
    playerImg: null,
    deadImg: null,
    deathAnim: null,
    playerWidth: 100,
    gameSpeed: 10,
    active: false,
    timer: null,
    KEYS: {
      LEFT: 37,
      RIGHT: 39
    },
    keyPressed: [],
    player: {
      x: 0,
      y: 0,
      facing: -1
    },
    blockSpawnTime: 850,
    blocksTimer: null,
    blockColors: ['#70ef37', '#34b5ff', '#6431e7', '#ff4800', '#5ccdab', '#852941', '#f8eb32', '#b537ef', '#e731c4', '#028793', '#ff8000', '#2f17e8', '#754d29', '#ef4137'],
    score: 0,
    blocks: [],

    className: 'p-game window',
    events: {
      'click #start-game': 'startGame'
    },
    initialize: function(){

      var self = this;


      $(window).on('blur', function(){
        self.endGame();
      })

      $(window).bind("resize.app", _.bind(this.resizeGame, this));

      $(document).bind('keydown', _.bind(this.keyDownHandler, this));
      $(document).bind('keyup', _.bind(this.keyUpHandler, this));



      this.$el.append(this.template({}));

      this.canvas = this.$el.find('#game-canvas')[0];
      this.ctx = this.canvas.getContext('2d');

      var hammertime = new Hammer(this.canvas, {
        time: 50
      });

      this.$el.find('.go-left').on('touchstart', function(e){
        self.keyPressed[self.KEYS.LEFT] = true;
      });
      this.$el.find('.go-right').on('touchstart', function(e){
        self.keyPressed[self.KEYS.RIGHT] = true;
      });

      this.$el.find('.go-left, .go-right').on(' touchend', function(e){
        delete self.keyPressed[self.KEYS.RIGHT];
        delete self.keyPressed[self.KEYS.LEFT];
      })

      this.playerImg = new Image();
      this.playerImg.src = '/static/i/logo_red.svg';
      this.deadImg = new Image();
      this.deadImg.src = '/static/i/logo_red_dead.svg';

      this.initGame();

      this.$el.append(this.playerImg);

      this.render();

    },

    render: function(){
      document.body.appendChild(this.el);
    },

    initGame: function(){

      this.canvas.width = $(window).width();
      this.canvas.height = $(window).height();

      this.playerWidth = Math.max(this.canvas.width, this.canvas.height) / 7;

      if (this.playerWidth < 90) this.playerWidth = 90;
      if (this.playerWidth > 180) this.playerWidth = 180;

      this.gameSpeed = this.playerWidth/14;

      this.player.x = this.canvas.width / 2 - this.playerWidth/2;
      this.player.y = this.canvas.height - this.playerWidth - 15;

      this.playerImg.src = '/static/i/logo_red.svg';

      this.score = 0;

      this.blocks = [];

      $(this.playerImg).css({
        position: 'absolute',
        width: this.playerWidth,
        height: this.playerWidth,
        left: this.player.x,
        top: this.player.y
      })

      this.active = true;

    },

    startGame: function(e){

      var self = this;

      this.deathAnim && this.deathAnim.kill();

      this.initGame();
      this.loop();

      this.$el.find('#start-game').hide();
      this.$el.find('#score').show();

      this.blocksTimer = setInterval(function(){
        self.spawnBlock();
      }, this.blockSpawnTime);

    },

    endGame: function(){

      this.active = false;
      clearInterval(this.blocksTimer);

      window.cancelAnimationFrame(this.timer);

      this.$el.find('#start-game').show();

      this.$el.find('#score').hide();

    },

    resizeGame: function(){

      if (this.active) this.endGame();
      this.initGame();

    },

    loop: function(){

      var self = this;
      if (this.active){
        this.draw();
        this.update();
        this.timer = window.requestAnimationFrame(function(){
          self.loop();
        });
      }


    },

    draw: function(){
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      for (var i = 0, len = this.blocks.length; i < len; i++){
        var b = this.blocks[i];
        this.ctx.fillStyle = b.color;
        this.ctx.fillRect(b.x, b.y, this.playerWidth, this.playerWidth);
      }
      this.$el.find('#score').html(this.score);
    },

    update: function(){
      this.ctx.save();

      for (var i = 0, len = this.blocks.length; i < len; i++){
        var b = this.blocks[i];

        b.y += this.gameSpeed;

        if (b.y >= this.canvas.height){
          this.blocks.splice(i, 1);
          this.score ++;
          i--;
          len--;
          continue;
        }

        if (RectCircleColliding(this.player.x + this.playerWidth/2, this.player.y + this.playerWidth/2, (this.playerWidth/2) * .80,
                                b.x, b.y, this.playerWidth, this.playerWidth)){
          this.endGame();
          this.deathAnimation();
        };

      }

      if (this.keyPressed[this.KEYS.RIGHT]){

        if (this.player.facing == -1) {
          this.player.facing = 1;
          TweenMax.to(this.playerImg, .2, {rotationX: 180});
        }

        this.player.x += this.gameSpeed * 1.5;
        TweenMax.to(this.playerImg, 0, {rotation: '+='+this.gameSpeed});
      }
      if (this.keyPressed[this.KEYS.LEFT]){

        if (this.player.facing == 1) {
          this.player.facing = -1;
          TweenMax.to(this.playerImg, .2, {rotationX: 0});
        }

        this.player.x -= this.gameSpeed * 1.5;
        TweenMax.to(this.playerImg, 0, {rotation: '-='+this.gameSpeed});
      }
      this.player.x = Math.min(Math.max(0, this.player.x), this.canvas.width - this.playerWidth);
      $(this.playerImg).css({left: this.player.x});
      this.ctx.restore();
    },

    keyDownHandler: function(e){
      this.keyPressed[e.keyCode] = true;
    },
    keyUpHandler: function(e){
      delete this.keyPressed[e.keyCode];
    },


    spawnBlock: function(){
      this.blocks.push({
        color: this.blockColors[Math.floor(Math.random()*this.blockColors.length)],
        x: Math.floor(Math.random()*Math.round($(window).width()/this.playerWidth)) * this.playerWidth,
        y: -this.playerWidth
      });
    },

    deathAnimation: function(){
      this.playerImg.src = this.deadImg.src;
      this.deathAnim = TweenMax.to(this.playerImg, 1.2, {rotation: '+='+200, top: '+='+500, ease: Back.easeInOut, delay: .65});
    }

  });

  function AABBIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
    return ax < bx+bw && bx < ax+aw && ay < by+bh && by < ay+ah;
  };

  function RectCircleColliding(cx, cy, cr, rx, ry, rw, rh){
    var distX = Math.abs(cx - rx-rw/2);
    var distY = Math.abs(cy - ry-rh/2);

    if (distX > (rw/2 + cr)) { return false; }
    if (distY > (rh/2 + cr)) { return false; }

    if (distX <= (rw/2)) { return true; }
    if (distY <= (rh/2)) { return true; }

    var dx=distX-rw/2;
    var dy=distY-rh/2;
    return (dx*dx+dy*dy<=(cr*cr));
  }

  return GameView;



})