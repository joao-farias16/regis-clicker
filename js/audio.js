/**
 * audio.js — efeitos sonoros gerados via Web Audio API.
 * Não depende de nenhum arquivo de áudio externo.
 */

const AudioFX = {
  ctx: null,
  soundEnabled: true,
  musicEnabled: true,

  _ensureContext() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch (e) {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  },

  setEnabled(sound, music) {
    this.soundEnabled = sound;
    this.musicEnabled = music;
  },

  /** toca um "beep" simples de duração/frequência configuráveis */
  _beep({ freq = 440, duration = 0.08, type = 'sine', volume = 0.08, glide = 0 }) {
    if (!this.soundEnabled) return;
    const ctx = this._ensureContext();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (glide) osc.frequency.exponentialRampToValueAtTime(Math.max(freq + glide, 20), ctx.currentTime + duration);
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // falha silenciosa: áudio nunca deve quebrar o jogo
    }
  },

  play(kind) {
    if (!this.soundEnabled) return;
    switch (kind) {
      case 'click':
        this._beep({ freq: 520, duration: 0.05, type: 'triangle', volume: 0.05, glide: 40 });
        break;
      case 'buy':
        this._beep({ freq: 300, duration: 0.09, type: 'square', volume: 0.06, glide: 200 });
        break;
      case 'upgrade':
        this._beep({ freq: 440, duration: 0.12, type: 'sine', volume: 0.08, glide: 300 });
        break;
      case 'achievement':
        this._beep({ freq: 660, duration: 0.15, type: 'sine', volume: 0.09, glide: 220 });
        setTimeout(() => this._beep({ freq: 880, duration: 0.15, type: 'sine', volume: 0.09 }), 100);
        break;
      case 'event':
        this._beep({ freq: 700, duration: 0.1, type: 'sawtooth', volume: 0.07, glide: -200 });
        break;
      case 'ascend':
        this._beep({ freq: 300, duration: 0.25, type: 'sine', volume: 0.1, glide: 700 });
        break;
      default:
        this._beep({});
    }
  }
};
