/**
 * 楊梅高中分機資訊網 - Web Audio API 音效引擎
 * 內建合成音效：按鍵點擊、真實電話 DTMF 撥號音、成功複製叮聲、收藏星光音、撥號響鈴
 * 零外部音訊檔案相依，極速載入且無延遲
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.volume = 0.25; // 溫和預設音量
    
    // 從 localStorage 讀取音效設定
    const savedMute = localStorage.getItem('ymhs_sound_muted');
    if (savedMute !== null) {
      this.enabled = savedMute !== 'true';
    }
    
    // DTMF 雙音多頻電話頻率對照表 (Hz)
    this.dtmfFreqs = {
      '1': [697, 1209],
      '2': [697, 1336],
      '3': [697, 1477],
      '4': [770, 1209],
      '5': [770, 1336],
      '6': [770, 1477],
      '7': [852, 1209],
      '8': [852, 1336],
      '9': [852, 1477],
      '*': [941, 1209],
      '0': [941, 1336],
      '#': [941, 1477]
    };
  }

  // 初始化或恢復 AudioContext
  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem('ymhs_sound_muted', (!this.enabled).toString());
    if (this.enabled) {
      this.playDing();
    }
    return this.enabled;
  }

  isSoundEnabled() {
    return this.enabled;
  }

  // 1. 溫和介面點擊音效 (Soft Click / Tap)
  playClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.05);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // 2. 成功複製音效 (Pleasant Success Chime)
  playSuccess() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(this.volume * 0.5, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.22);
      });
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // 3. 收藏星星音效 (Sparkle Star Sound)
  playFavorite(isAdded = true) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = isAdded ? [587.33, 880, 1174.66] : [783.99, 523.25];

      freqs.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);

        gain.gain.setValueAtTime(this.volume * 0.45, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.2);
      });
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // 4. 真實電話雙音多頻撥號音 (Real DTMF Tone for Phone Keys)
  playDtmf(key) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const freqs = this.dtmfFreqs[key];
    if (!freqs) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 0.14; // 秒

      // 產生低頻與高頻兩個振盪器
      const oscLow = this.ctx.createOscillator();
      const oscHigh = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      oscLow.type = 'sine';
      oscLow.frequency.setValueAtTime(freqs[0], now);

      oscHigh.type = 'sine';
      oscHigh.frequency.setValueAtTime(freqs[1], now);

      gain.gain.setValueAtTime(this.volume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      oscLow.connect(gain);
      oscHigh.connect(gain);
      gain.connect(this.ctx.destination);

      oscLow.start(now);
      oscHigh.start(now);
      oscLow.stop(now + duration);
      oscHigh.stop(now + duration);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  // 5. 連續撥打分機號碼串音 (Dial whole extension sequence)
  playExtensionSequence(numberStr, onComplete) {
    if (!this.enabled) {
      if (onComplete) onComplete();
      return;
    }
    this.initContext();

    const digits = numberStr.replace(/[^0-9*#]/g, '').split('');
    let delay = 0;
    const digitInterval = 160; // 毫秒

    digits.forEach((char, index) => {
      setTimeout(() => {
        this.playDtmf(char);
        if (index === digits.length - 1 && onComplete) {
          setTimeout(onComplete, 220);
        }
      }, delay);
      delay += digitInterval;
    });

    if (digits.length === 0 && onComplete) {
      onComplete();
    }
  }

  // 6. 模擬電話響鈴音 (Telephone Ringback Tone)
  playRingback(cycles = 2, onDone) {
    if (!this.enabled) {
      if (onDone) onDone();
      return;
    }
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const ringDuration = 0.8;
      const gap = 0.6;

      for (let i = 0; i < cycles; i++) {
        const startTime = now + i * (ringDuration + gap);
        
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // 台灣/美規常見回鈴音 440Hz + 480Hz
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(440, startTime);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(480, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.volume * 0.4, startTime + 0.05);
        gain.gain.setValueAtTime(this.volume * 0.4, startTime + ringDuration - 0.05);
        gain.gain.linearRampToValueAtTime(0.001, startTime + ringDuration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + ringDuration);
        osc2.stop(startTime + ringDuration);
      }

      if (onDone) {
        setTimeout(onDone, cycles * (ringDuration + gap) * 1000);
      }
    } catch (e) {
      console.warn("Ringback error", e);
    }
  }

  // 7. 輕巧叮聲
  playDing() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.warn("Ding error", e);
    }
  }
}

// 實例化音效引擎
const sounds = new SoundEngine();
