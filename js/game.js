import { Cell } from './cell';

export function Game(muse) {
  let _muse = muse;
  this.mode = _muse.MODE_DEFAULT;
  this.cells;
  this.column = 0;
  let prev_column = 0;
  let previous_ms = new Date().getTime();

  let neighbour = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  let save_btn;
	let clear_btn;
  let gol_btn;
  
  this.init = function() {
    this.cells = new Array(_muse.CELL_NUMBER);
    // 数据是可以存储在 url 中的
    let codes = location.search.substr(1).split('.');
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i] = new Array(_muse.CELL_NUMBER);
      var code = decodeURIComponent(codes[i]||0);
      for (let j = 0; j < this.cells[i].length; j++) {
        let mask = 1<<j;
        this.cells[i][j] = new Cell(_muse, {i, j, status: (code&mask)>>j});
      }
    }

    let btn_dom = `
    <style>
      .game-btns {
        height: 50px;
        text-align: center;
      }
      .game-btn{
        display: inline-block;
        height: 40px;
        width: 100px;
        margin: 5px;
        background: #9a0095;
        color: white;
        text-align: center;
        line-height: 40px;
        font-size: smaller;
      }
      .game-btn:hover {
        background: #670063;
      }
    </style>
      <div class='game-btns'>
        <div class='game-btn btn-clear'>Clear</div>
        <div class='game-btn btn-url'>Url</div>
        <div class='game-btn btn-default'>Default</div>
      </div>
    </div>
    `;
    let domFrag = document.createElement('div');
    domFrag.innerHTML = btn_dom;
    _muse.canvas.parentElement.appendChild(domFrag);

    this.clear_btn = document.getElementsByClassName('btn-clear')[0];
    this.save_btn = document.getElementsByClassName('btn-url')[0];
    this.gol_btn = document.getElementsByClassName('btn-default')[0];
    this.clear_btn.addEventListener('click', () => {
      this.clear_map();
    });
    this.save_btn.addEventListener('click', () => {
      this.make_url();
    });
    this.gol_btn.addEventListener('click', () => {
      this.toggle_gol();
    });
  };

  this.update = function() {
    if (_muse.input.state != _muse.input.UNSET) {
      let broke = false;
      for (let i = 0; i < this.cells.length; i++) {
        for (let j = 0; j < this.cells[0].length; j++) {
          let c = this.cells[i][j];
          if (_muse.input.in_rect_area(c.x, c.y, _muse.CELL_SIZE, _muse.CELL_SIZE)) {
            if (_muse.input.state == _muse.input.SET) {
              c.status = 1 - c.status;
              _muse.input.state = c.status;
              _muse.waveMap.drop(i, j);
            } else {
              if (c.status != _muse.input.state) {
                c.status = _muse.input.state;
                _muse.waveMap.drop(i, j);
              }
            }

            broke = true;
            break;
          }
        }
        if (broke) {
          break;
        }
      }
    }

    let this_ms = new Date().getTime();

    if (this_ms - previous_ms >= _muse.INTERVAL) {
      previous_ms = this_ms;
      this.column = (this.column + 1) % _muse.CELL_NUMBER;
      for (let i = 0; i<this.cells.length; i++) {
        this.cells[i][prev_column].playing = false;
        if (this.cells[i][this.column].status) {
          this.cells[i][this.column].playing = true;
          _muse.synth.play(i);
          _muse.waveMap.drop(i, this.column);
        }
      }
      prev_column = this.column;

      if (this.mode === _muse.MODE_GAME_OF_LIFE && this.column === _muse.CELL_NUMBER - 1) {
        for (let i = 0; i < this.cells.length; i++) {
          for (let j = 0; j < this.cells[i].length; j++) {
            let alive = 0;
            for (let k = 0; k < neighbour.length; k++) {
              let ni = i + neighbour[k][0];
              let nj = j + neighbour[k][1];
              ni = (ni < 0) ? ni + this.cells.length : (ni >= this.cells.length) ? ni - this.cells.length : ni;
              nj = (nj < 0) ? nj + this.cells[i].length : (nj >= this.cells[i].length) ? nj - this.cells[i].length : nj;
              alive += this.cells[ni][nj].status;
            }
            if (alive < 2 || alive > 3) {
              this.cells[i][j].next_status = 0;
            } else if (alive == 3) {
              this.cells[i][j].next_status = 1;
            } else {
              this.cells[i][j].next_status = this.cells[i][j].status;
            }
          }
        }
        for (var i = 0; i < this.cells.length; i++) {
          for (var j = 0; j < this.cells[i].length; j++) {
            this.cells[i][j].status = this.cells[i][j].next_status;
          }
        }
      } 
    }
    _muse.waveMap.update();
  };

  this.render = function() {
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].render();
      }
    }
    
  };

  this.make_url = function() {
    let codes = '?';
    for (let i = 0; i < this.cells.length; i++) {
      let code = 0;
      for (let j = 0; j < this.cells[i].length; j++) {
        code |= this.cells[i][j].status << j;
      }
      codes += code + '.';
    }
    window.history.replaceState('', '', 'index.html'+codes);
  };

  this.clear_map = function() {
    this.mode = _muse.MODE_DEFAULT;
    this.gol_btn.innerText = 'Default';
    for (let i = 0; i < this.cells.length; i++) {
      for (let j = 0; j < this.cells[i].length; j++) {
        this.cells[i][j].pause();
        this.cells[i][j].status = 0;
      }
    }
    window.history.replaceState('', '', 'index.html');
  };

  this.toggle_gol = function() {
    this.mode = 1 - this.mode;
    if (this.mode === _muse.MODE_DEFAULT) {
      this.gol_btn.innerText = ('Default');
    } else {
      this.gol_btn.innerText = 'Game of Life';
      for (let i = 0; i < this.cells.length; i++){
        for (let j = 0; j < this.cells[i].length; j++) {
          this.cells[i][j].pause();
          this.cells[i][j].status = _muse.random(2);
        }
      }        
    }
  }
}