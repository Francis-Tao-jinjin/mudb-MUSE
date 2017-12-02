export function Input(muse) {
  let _muse = muse;
  this.x = this.y = 0;
  
  this.UNSET = -1;
  this.SET = 2;
  this.ON = 1;
  this.OFF = 0;
  this.state = -1;

  let move = false;

  // _muse.input = this;

  this.init = function() {
    _muse.canvas.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.set(e);
    }, false);

    _muse.canvas.addEventListener('mousemove', (e) => {
      e.preventDefault();
      this.modify(e);
    }, false);

    _muse.canvas.addEventListener('mouseup', (e) => {
      e.preventDefault();
      this.unset(e);
    }, false);

    _muse.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.set(e);
    }, false);

    _muse.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      this.modify(e);
    }, false);

    _muse.canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.unset(e);
    }, false);
  };

  this.set = function(event) {
    // event.button = event.button || 0;
    // if (event.button === 0) {
      this.x = event.pageX - _muse.canvas.offsetLeft;
      this.y = event.pageY - _muse.canvas.offsetTop;
      this.state = this.SET;
      this.moved = false;
    // }
  };

  this.unset = function(event) {
    // event.button = event.button || 0;
    // if (event.button === 0) {
      this.state = this.UNSET;
    // }
  };

  this.modify = function(event) {
    this.x = event.pageX - _muse.canvas.offsetLeft;
    this.y = event.pageY - _muse.canvas.offsetTop;  
    this.moved = true;
  };

  this.in_rect_area = function(x, y, w, h) {
    if (this.x >= x && this.x <= x + w && this.y >= y && this.y <= y + h){
			return true;
		}
		return false;
  };
};