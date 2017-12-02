export function Cell(muse, data) {
  let _muse = muse;
  this.i = data.i;
  this.j = data.j;
  this.x = this.j * (_muse.CELL_SIZE + _muse.CELL_GAP);
  this.y = this.i * (_muse.CELL_SIZE + _muse.CELL_GAP);
  this.status = data.status;

  this.next_status = this.status;
  this.color = _muse.ON;

  this.palying = false;

  this.render = function() {
    if (this.palying) {
      this.color = '#ffffff';
    } else {
      this.color = ~~(((this.status) ? _muse.ON : _muse.OFF) + 0xff * (_muse.waveMap.curr_map[this.i][this.j] / _muse.WAVE_FORCE));
      this.color = (this.color > 220) ? 220 : this.color;
      let temp = this.color.toString(16);
      this.color = '#' + temp + '' + temp + '' + temp;
    }

    // this.color = '#ffffff';

    _muse.ctx.fillStyle = this.color;

    // 圆角矩形
    _muse.ctx.beginPath();
    _muse.ctx.moveTo(this.x, this.y + _muse.CELL_RADIUS);
    _muse.ctx.lineTo(this.x, this.y + _muse.CELL_SIZE - _muse.CELL_RADIUS);
    _muse.ctx.quadraticCurveTo(this.x, this.y + _muse.CELL_SIZE, this.x + _muse.CELL_RADIUS, this.y + _muse.CELL_SIZE);
		_muse.ctx.lineTo(this.x + _muse.CELL_SIZE - _muse.CELL_RADIUS, this.y + _muse.CELL_SIZE);
		_muse.ctx.quadraticCurveTo(this.x + _muse.CELL_SIZE, this.y + _muse.CELL_SIZE, this.x + _muse.CELL_SIZE, this.y + _muse.CELL_SIZE - _muse.CELL_RADIUS);
		_muse.ctx.lineTo(this.x + _muse.CELL_SIZE, this.y + _muse.CELL_RADIUS);
		_muse.ctx.quadraticCurveTo(this.x + _muse.CELL_SIZE, this.y, this.x + _muse.CELL_SIZE - _muse.CELL_RADIUS, this.y);
		_muse.ctx.lineTo(this.x + _muse.CELL_RADIUS, this.y);
		_muse.ctx.quadraticCurveTo(this.x, this.y, this.x, this.y + _muse.CELL_RADIUS);
		_muse.ctx.fill();		
  };

  this.play = function() {
    this.playing = true;
  };

  this.pause = function() {
    this.playing = false;
  };
}