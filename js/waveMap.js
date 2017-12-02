export function MuseWave(muse) {
  let _muse = muse;
  let next_map;
  this.curr_map;
  let buffer;
  let previous_ms = new Date().getTime();
  let neighbours = [
    [-1, -1], [0, -1], [1, -1], [1, 0],
    [1, 1], [0, 1], [-1, 1], [-1, 0],
    [-2, 0], [0, -2], [2, 0], [0, 2]
  ];

  // _muse.waveMap = this;

  this.init = function() {
    next_map = new Array(_muse.length);
    for (let i = 0; i < _muse.CELL_NUMBER; i++) {
      next_map[i] = new Array(_muse.CELL_NUMBER);
      for (let j = 0; j < _muse.CELL_NUMBER; j++) {
        next_map[i][j] = 0;
      }
    }

    this.curr_map = this.deepCopy(next_map);
    buffer = this.deepCopy(next_map);
  };

  this.drop = function(i, j) {
    this.curr_map[i][j] = _muse.WAVE_FORCE;
  };

  this.update = function() {
    let ms = new Date().getTime();
    if (ms - previous_ms >= _muse.WAVE_INTERVAL) {
      previous_ms = ms;
      for (let i = 0; i < this.curr_map.length; i++) {
        for (let j = 0; j < this.curr_map[i].length; j++) {
          let neighbours_number = 0;
          let neighbours_sum = 0;
          for (let k = 0; k < neighbours.length; k++){
						let ni = i + neighbours[k][0];
						let nj = j + neighbours[k][1];
						if (ni >= 0 && ni < _muse.CELL_NUMBER && nj >= 0 && nj < _muse.CELL_NUMBER){
							neighbours_number++;
							neighbours_sum += this.curr_map[ni][nj];
						}
          }
          let new_value = ~~(neighbours_sum/~~(neighbours_number/2)) - next_map[i][j];
          new_value -= new_value * _muse.WAVE_DAMP;
          buffer[i][j] = (new_value < 0.1) ? 0 : new_value;
        }
      }
      next_map = this.deepCopy(this.curr_map);
      this.curr_map = this.deepCopy(buffer);
    } 
  }
}

MuseWave.prototype.deepCopy = function(source) {
  let copy = new Array(source.length);
  for (let i = 0; i<source.length; i++) {
    copy[i] = source[i].slice(0);
  }
  return copy;
}