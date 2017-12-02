import { Voice } from './voice';

export function Synth(muse) {
  let _muse = muse;
  this.context;
  this.reverb;
  this.compressor;
  this.filter;
  let voices;

  // _muse.synth = this;

  this.init = function() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    this.context = new AudioContext();

    this.reverb = this.context.createConvolver();
    let rate = this.context.sampleRate;
    let len = rate * 2;
    let decay = 15;
    let impulse = this.context.createBuffer(2, len, rate);
    let impulseL = impulse.getChannelData(0);
    let impulseR = impulse.getChannelData(1);

    for (let i = 0; i < len; i++) {
      impulseL[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      impulseR[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
      if (i > len/3) {
        decay = 8;
      }
    }
    this.reverb.buffer = impulse;

    this.compressor = this.context.createDynamicsCompressor();

    this.filter = this.context.createBiquadFilter();
    // this.filter.type = this.filter.LOWPASS;
    this.filter.frequency.value = _muse.START_NOTE * 3;

    this.filter.connect(this.reverb);
    this.reverb.connect(this.compressor);
    this.compressor.connect(this.context.destination);

    // each line will have a player
    this.voices = new Array(_muse.CELL_NUMBER);
    let base_freq = _muse.START_NOTE;
    let ratio_index = 0;
    for (let i = this.voices.length - 1; i >= 0; i--) {
      this.voices[i] = new Voice(_muse,this.context,base_freq*_muse.NOTE_RATIOS[ratio_index++]);
      if (ratio_index == 5) {
        base_freq = base_freq * _muse.NOTE_RATIOS[ratio_index];
        ratio_index = 0;
      }
    }
    this.ready = true;
  };

  this.play = function(n) {
    this.voices[n].play();
  }
}