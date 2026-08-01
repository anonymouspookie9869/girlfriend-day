// Web Audio API procedural ambient synth engine for soothing background music

class AmbientSynthEngine {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private timer: number | null = null;
  private currentVolume: number = 0.3;
  private isDucked: boolean = false;
  private duckFactor: number = 0.25;

  // Gentle Pentatonic / Lydian chord notes (frequencies in Hz)
  private frequencies = [
    261.63, // C4
    293.66, // D4
    329.63, // E4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    659.25, // E5
    783.99, // G5
    880.00, // A5
  ];

  public init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioCtx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      const target = this.isDucked ? this.currentVolume * this.duckFactor : this.currentVolume;
      this.masterGain.gain.value = target;
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public setDucked(ducked: boolean, factor: number = 0.25) {
    this.isDucked = ducked;
    this.duckFactor = factor;
    const target = this.isDucked ? this.currentVolume * this.duckFactor : this.currentVolume;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.3);
    }
  }

  public getIsDucked(): boolean {
    return this.isDucked;
  }

  public setVolume(val: number) {
    this.currentVolume = Math.max(0, Math.min(1, val));
    const target = this.isDucked ? this.currentVolume * this.duckFactor : this.currentVolume;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
    }
  }

  public getVolume(): number {
    return this.currentVolume;
  }

  public start() {
    this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    // Schedule gentle ambient chimes & notes
    const playNextNote = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;

      const freq = this.frequencies[Math.floor(Math.random() * this.frequencies.length)];
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      // Soft sine tone with subtle warmth
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const now = this.ctx.currentTime;
      const attack = 0.8 + Math.random() * 0.5;
      const decay = 2.5 + Math.random() * 2.0;

      noteGain.gain.setValueAtTime(0, now);
      noteGain.gain.linearRampToValueAtTime(0.12, now + attack);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + attack + decay);

      osc.connect(noteGain);
      noteGain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + attack + decay);

      // Schedule next chime interval (randomized 1.2s - 2.8s)
      const delay = 1200 + Math.random() * 1600;
      this.timer = window.setTimeout(playNextNote, delay);
    };

    playNextNote();
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const ambientSynth = new AmbientSynthEngine();
