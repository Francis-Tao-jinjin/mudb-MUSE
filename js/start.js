export function Start(muse) {
  let _muse = muse;
  this.init = function() {
    window.addEventListener("mousedown", this.touchstart_callback, false);
		window.addEventListener("touchstart", this.touchstart_callback, false);
  };

  this.touchstart_callback = function(e) {
    e.preventDefault();
    _muse.synth.init();
    window.removeEventListener('mousedown', this.touchstart_callback, false);
    window.removeEventListener('touchstart', this.touchstart_callback, false);
  };

  this.update = function() {
    if (_muse.synth.ready) {
      _muse.input.init();
      _muse.state = _muse.game;
    }
  };

  this.render = function() {
    _muse.game.render();
  }
}
