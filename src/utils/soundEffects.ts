class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.8;
  private suspenseOsc: OscillatorNode | null = null;
  private suspenseGain: GainNode | null = null;

  constructor() {
    // Context will be lazily initialized on user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
  }

  // Wooden click sound for cycling through names
  public playTick(pitchMultiplier: number = 1.0) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      const baseFreq = 580 * pitchMultiplier;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.04);

      gain.gain.setValueAtTime(0.18 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // AudioContext policy safe catch
    }
  }

  // Tension drone during the 5-second random selection
  public startSuspense(durationSec: number = 5) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.stopSuspense();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(170, now + durationSec);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, now);
      filter.frequency.exponentialRampToValueAtTime(550, now + durationSec);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12 * this.volume, now + 0.4);
      gain.gain.setValueAtTime(0.12 * this.volume, now + durationSec - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + durationSec + 0.05);

      this.suspenseOsc = osc;
      this.suspenseGain = gain;
    } catch {
      // Ignore
    }
  }

  public stopSuspense() {
    try {
      if (this.suspenseGain && this.ctx) {
        this.suspenseGain.gain.setValueAtTime(this.suspenseGain.gain.value, this.ctx.currentTime);
        this.suspenseGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      }
      setTimeout(() => {
        try {
          if (this.suspenseOsc) {
            this.suspenseOsc.stop();
            this.suspenseOsc.disconnect();
            this.suspenseOsc = null;
          }
          if (this.suspenseGain) {
            this.suspenseGain.disconnect();
            this.suspenseGain = null;
          }
        } catch {}
      }, 70);
    } catch {}
  }

  // Start spin chime
  public playStart() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880];
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + idx * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.2 * this.volume, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.24);
      });
    } catch {
      // Ignore
    }
  }

  // Joyful fanfare when a student is selected
  public playWinnerFanfare() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      // Pentatonic bright chime sequence (Vietnamese celebratory feel)
      const chordNotes = [
        { freq: 523.25, time: 0.0, dur: 0.3 }, // C5
        { freq: 659.25, time: 0.1, dur: 0.35 }, // E5
        { freq: 783.99, time: 0.2, dur: 0.4 }, // G5
        { freq: 1046.5, time: 0.32, dur: 0.6 }, // C6
        { freq: 1318.51, time: 0.46, dur: 0.8 }, // E6
      ];

      const now = this.ctx.currentTime;

      chordNotes.forEach(({ freq, time, dur }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0.26 * this.volume, now + time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur + 0.05);
      });

      // Warm bass undertone for richness
      const bass = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bass.type = 'sine';
      bass.frequency.setValueAtTime(261.63, now); // C4
      bassGain.gain.setValueAtTime(0.2 * this.volume, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      bass.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bass.start(now);
      bass.stop(now + 1.0);
    } catch {
      // Ignore
    }
  }

  // Round completion fanfare
  public playCompleteRound() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const melody = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51];
      const now = this.ctx.currentTime;

      melody.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = now + idx * 0.11;
        const dur = idx === melody.length - 1 ? 0.7 : 0.2;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.22 * this.volume, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + dur + 0.05);
      });
    } catch {
      // Ignore
    }
  }

  // Soft UI click
  public playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);
      gain.gain.setValueAtTime(0.12 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Ignore
    }
  }
}

export const soundEffects = new SoundEngine();
