export function Voice(muse, context, frequency) {
  let _muse = muse;
  let sine_osc = context.createOscillator();
  sine_osc.frequency.value = frequency;
  // ine_osc.type = sine_osc.SINE;
  if (!sine_osc.start) {
    sine_osc.start = sine_osc.noteOn;
  }

  let gain = context.createGain();
  gain.gain.value = 0;

  sine_osc.connect(gain);
  gain.connect(_muse.synth.filter);
  sine_osc.start(0);

  this.sine_osc = sine_osc;
  this.gain = gain;

  this.play = function() {
    let now = context.currentTime;
    this.gain.gain.cancelScheduledValues(now);
    this.gain.gain.setValueAtTime(this.gain.gain.value, now);

    // an smart way to create envelop
    this.gain.gain.linearRampToValueAtTime(_muse.VOLUME, now + _muse.ENVELOPE[0]);
    this.gain.gain.linearRampToValueAtTime(_muse.ENVELOPE[2], now + _muse.ENVELOPE[0] + _muse.ENVELOPE[1]);
  }
}