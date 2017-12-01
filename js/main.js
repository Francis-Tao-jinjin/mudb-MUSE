function MUSE() {
  WIDTH = 0;
	HEIGHT = 0;
	CELL_SIZE = 24;
	CELL_RADIUS = 2;
	CELL_GAP = 8;
	CELL_NUMBER = 16;
	INTERVAL = 128;
	WAVE_INTERVAL = 25;
	WAVE_FORCE = 80;
	WAVE_DAMP = 0.1;
  MODE_DEFAULT = 0;
  
  BLACK = "#000000";
	SAVE_BTN_IDLE = "#dadada";
	SAVE_BTN_PRESSED = "#24E33B";
	OFF = 0x2a;
  ON = 0xda;
  
  VOLUME = 0.5;
  START_NOTE = 369.99;
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

