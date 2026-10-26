let audioContext = null;
let isSoundOn = loadSoundSetting();
 
function getAudioContext() {
  if (audioContext === null) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}
 
function playTone(options) {
  const { frequency, duration = 0.12, type = "sine", volume = 0.15, delay = 0 } = options;
  const ctx = getAudioContext();
  const start = ctx.currentTime + delay;
 
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
 
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(start);
  oscillator.stop(start + duration);
}

const SOUNDS = {
  flip: () => playTone({ frequency: 520, duration: 0.06, type: "triangle" }),
  match: () => {
    playTone({ frequency: 660, duration: 0.1 });
    playTone({ frequency: 880, duration: 0.18, delay: 0.1 });
  },
  mismatch: () => playTone({ frequency: 180, duration: 0.25, type: "sawtooth", volume: 0.08 }),
  clear: () => {
    [523, 659, 784, 1047].forEach((frequency, i) => {
      playTone({ frequency, duration: 0.2, delay: i * 0.12 });
    });
  },
  catch: () => playTone({ frequency: 880, duration: 0.08, type: "triangle" }),
  rotten: () => playTone({ frequency: 220, duration: 0.2, type: "square", volume: 0.06 }),
  bomb: () => playTone({ frequency: 110, duration: 0.35, type: "sawtooth", volume: 0.12 }),
  miss: () => playTone({ frequency: 260, duration: 0.18, type: "square", volume: 0.07 }),
  gameover: () => {
    [440, 392, 330, 262].forEach((frequency, i) => {
      playTone({ frequency, duration: 0.25, delay: i * 0.18 });
    });
  },
};
 
function playSound(name) {
  if (!isSoundOn) return;
  SOUNDS[name]();
}

const BGM_NOTES = [262, 330, 392, 330, 294, 349, 440, 349];
let bgmTimerId = null;
let bgmIndex = 0;
 
function playBgmStep() {
  playTone({ frequency: BGM_NOTES[bgmIndex], duration: 0.28, volume: 0.04 });
  bgmIndex = (bgmIndex + 1) % BGM_NOTES.length;
  bgmTimerId = setTimeout(playBgmStep, 320);
}
 
function startBgm() {
  if (!isSoundOn || bgmTimerId !== null) return;
  playBgmStep();
}
 
function stopBgm() {
  clearTimeout(bgmTimerId);
  bgmTimerId = null;
}