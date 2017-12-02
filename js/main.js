import { Input } from './input';
import { MuseWave } from './waveMap';
import { Game } from './game';
import { Synth } from './synth';
import { Start } from './start';
 
function MUSE() {
  this.WIDTH = 0;
	this.HEIGHT = 0;
	this.CELL_SIZE = 24;
	this.CELL_RADIUS = 2;
	this.CELL_GAP = 8;
	this.CELL_NUMBER = 16;
	this.INTERVAL = 128;
	this.WAVE_INTERVAL = 25;
	this.WAVE_FORCE = 80;
	this.WAVE_DAMP = 0.1;
  this.MODE_DEFAULT = 0;
  this.MODE_GAME_OF_LIFE = 1;
  
  this.BLACK = "#000000";
	this.SAVE_BTN_IDLE = "#dadada";
	this.SAVE_BTN_PRESSED = "#24E33B";
	this.OFF = 0x2a;
  this.ON = 0xda;
  
  this.VOLUME = 0.5;
  this.START_NOTE = 369.99;
  this.NOTE_RATIOS = [1, 9/8, 5/4, 3/2, 5/3, 2];
  this.ENVELOPE = new Float32Array([0, 0.1, 0, 0]); //Attack Decay Sustain Release

  this.canvas = null;
  this.ctx = null;
  this.state = null;

  this.waveMap;
  this.input;
  this.synth;
  this.game;

  this.init = function() {
    this.canvas = document.getElementById('MUSE-BOARD');
    this.ctx = this.canvas.getContext('2d');

    this.WIDTH = this.CELL_NUMBER * this.CELL_SIZE + this.CELL_GAP * (this.CELL_NUMBER-1);
    this.HEIGHT = this.WIDTH;

    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    
    let iOS = (navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);

    this.waveMap = new MuseWave(this);
    this.input = new Input(this);
    this.synth = new Synth(this);
    this.game = new Game(this);
    this.start = new Start(this);

    this.waveMap.init();
    if (!iOS) {
      this.input.init();
      this.synth.init();
    } else {
      this.start.init();
    }
    this.game.init();
    this.state = (iOS) ? this.start : this.game;

    _loop();
  }

  this.update = function() {
    this.state.update();
  };

  this.render = function() {
    this.ctx.fillStyle = this.BLACK;
    this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
    this.state.render();
  };

  let self = this;
  function _loop() {
    requestAnimationFrame(self.loop);
    self.update();
    self.render();
  }

  this.loop = _loop;


  this.random = function(n) {
    return ~~(Math.random()*n);
  }
};

window.onload = function() {
  window.museBoard = new MUSE();
  window.museBoard.init();
}

window.requestAnimationFrame = (function() {
  return window.requestAnimationFrame|| 
  window.webkitRequestAnimationFrame || 
  window.mozRequestAnimationFrame    || 
  window.oRequestAnimationFrame      || 
  window.msRequestAnimationFrame     || 
  function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

