/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Elegant Web Audio API synthesizer for cozy soundscapes
// No dependencies, high performance, fully local & responsive!

class CozyAudioSynth {
  private ctx: AudioContext | null = null;
  private nodes: {
    rainSource?: AudioBufferSourceNode;
    rainFilter?: BiquadFilterNode;
    fireGain?: GainNode;
    droneSource1?: OscillatorNode;
    droneSource2?: OscillatorNode;
    masterGain?: GainNode;
  } = {};
  private activeSound: string = "none";
  private isRunning: boolean = false;
  private intervalId: any = null;

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  // Generate pink/white noise buffer for rain
  private createNoiseBuffer(): AudioBuffer {
    if (!this.ctx) throw new Error("AudioContext not initialized");
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Pink noise approximation for a warmer, softer rain sound than white noise
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // rescale
      b6 = white * 0.115926;
    }
    return noiseBuffer;
  }

  public setVolume(volumePercentage: number) {
    this.initCtx();
    const gainVal = volumePercentage / 100;
    if (this.nodes.masterGain && this.ctx) {
      this.nodes.masterGain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
    }
  }

  public startSound(type: string, volume: number) {
    try {
      this.stopSound();
      this.initCtx();
      if (!this.ctx) return;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(volume / 100, this.ctx.currentTime);
      masterGain.connect(this.ctx.destination);
      this.nodes.masterGain = masterGain;

      this.activeSound = type;
      this.isRunning = true;

      if (type === "rain") {
        // Soft constant rainfall
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();
        noise.loop = true;

        const rainFilter = this.ctx.createBiquadFilter();
        rainFilter.type = "lowpass";
        rainFilter.frequency.setValueAtTime(800, this.ctx.currentTime); // muffles high frequencies to sound cozy

        noise.connect(rainFilter);
        rainFilter.connect(masterGain);
        
        noise.start(0);
        this.nodes.rainSource = noise;
        this.nodes.rainFilter = rainFilter;

      } else if (type === "fire") {
        // Fireplace Crackling: low rumbling soft noise + rare spark impulses
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();
        noise.loop = true;

        const lowpass = this.ctx.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.frequency.setValueAtTime(150, this.ctx.currentTime); // low rumble

        const lowpassGain = this.ctx.createGain();
        lowpassGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

        noise.connect(lowpass);
        lowpass.connect(lowpassGain);
        lowpassGain.connect(masterGain);

        this.nodes.rainSource = noise;

        // Start random fire sparks loop using scheduling
        const triggerSpark = () => {
          if (!this.isRunning || !this.ctx || this.activeSound !== "fire") return;
          
          const sparkOsc = this.ctx.createOscillator();
          const sparkGain = this.ctx.createGain();
          
          sparkOsc.type = "triangle";
          // High pitch short crackle
          sparkOsc.frequency.setValueAtTime(1200 + Math.random() * 2000, this.ctx.currentTime);
          
          sparkGain.gain.setValueAtTime(0.08 + Math.random() * 0.15, this.ctx.currentTime);
          sparkGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05 + Math.random() * 0.05);

          sparkOsc.connect(sparkGain);
          sparkGain.connect(masterGain);

          sparkOsc.start();
          sparkOsc.stop(this.ctx.currentTime + 0.15);

          // trigger next spark
          const nextTime = 100 + Math.random() * 800; // ms
          this.intervalId = setTimeout(triggerSpark, nextTime);
        };

        triggerSpark();

      } else if (type === "space" || type === "lofi") {
        // Deep space drone or warm lo-fi pad oscillator chord
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        // 110Hz (A2) and a slightly detuned 110.4Hz for natural beautiful chorus breathing effect
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(110, this.ctx.currentTime);

        osc2.type = "triangle"; // warmer harmonics
        osc2.frequency.setValueAtTime(165.4, this.ctx.currentTime); // E3 (fifth)

        const filter = this.ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(300, this.ctx.currentTime);

        oscGain.gain.setValueAtTime(0.2, this.ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(masterGain);

        osc1.start(0);
        osc2.start(0);

        this.nodes.droneSource1 = osc1;
        this.nodes.droneSource2 = osc2;
      }
    } catch (e) {
      console.error("Synthesizer failed to start or Web Audio is restricted:", e);
    }
  }

  public stopSound() {
    this.isRunning = false;
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }

    try {
      if (this.nodes.rainSource) {
        this.nodes.rainSource.stop();
        this.nodes.rainSource = undefined;
      }
      if (this.nodes.droneSource1) {
        this.nodes.droneSource1.stop();
        this.nodes.droneSource1 = undefined;
      }
      if (this.nodes.droneSource2) {
        this.nodes.droneSource2.stop();
        this.nodes.droneSource2 = undefined;
      }
      if (this.nodes.masterGain) {
        this.nodes.masterGain.disconnect();
        this.nodes.masterGain = undefined;
      }
    } catch (e) {
      // already stopped or not started
    }

    this.activeSound = "none";
  }

  public getActiveSound(): string {
    return this.activeSound;
  }
}

export const cozySynth = new CozyAudioSynth();
