let audioContext = null;
let isPlaying = false;
let gainNode = null;
let currentOscillators = [];

const melody = [
    // Simple happy birthday melody (frequencies in Hz)
    { freq: 262, dur: 0.3 }, // C4
    { freq: 262, dur: 0.3 }, // C4
    { freq: 294, dur: 0.5 }, // D4
    { freq: 262, dur: 0.5 }, // C4
    { freq: 349, dur: 0.5 }, // F4
    { freq: 330, dur: 0.8 }, // E4
    { rest: 0.2 },
    { freq: 262, dur: 0.3 }, // C4
    { freq: 262, dur: 0.3 }, // C4
    { freq: 294, dur: 0.5 }, // D4
    { freq: 262, dur: 0.5 }, // C4
    { freq: 392, dur: 0.5 }, // G4
    { freq: 349, dur: 0.8 }, // F4
    { rest: 0.2 },
    { freq: 262, dur: 0.3 }, // C4
    { freq: 262, dur: 0.3 }, // C4
    { freq: 523, dur: 0.5 }, // C5
    { freq: 440, dur: 0.4 }, // A4
    { freq: 349, dur: 0.4 }, // F4
    { freq: 330, dur: 0.4 }, // E4
    { freq: 294, dur: 0.6 }, // D4
    { rest: 0.2 },
    { freq: 466, dur: 0.4 }, // Bb4
    { freq: 466, dur: 0.4 }, // Bb4
    { freq: 440, dur: 0.4 }, // A4
    { freq: 349, dur: 0.4 }, // F4
    { freq: 392, dur: 0.5 }, // G4
    { freq: 349, dur: 0.8 }, // F4
];

let playbackTimeout = null;

export function toggleMusic() {
    if (isPlaying) {
        stopMusic();
        return false;
    } else {
        startMusic();
        return true;
    }
}

function startMusic() {
    try {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            gainNode = audioContext.createGain();
            gainNode.gain.value = 0.12;
            gainNode.connect(audioContext.destination);
        }

        if (audioContext.state === "suspended") {
            audioContext.resume();
        }

        isPlaying = true;
        playMelody();
    } catch (e) {
        console.warn("Audio playback not supported");
    }
}

function playMelody() {
    if (!isPlaying || !audioContext || !gainNode) return;

    let time = audioContext.currentTime;
    currentOscillators = [];

    melody.forEach((note) => {
        if (note.rest) {
            time += note.rest;
            return;
        }

        const osc = audioContext.createOscillator();
        const noteGain = audioContext.createGain();

        osc.type = "triangle";
        osc.frequency.value = note.freq;

        noteGain.gain.setValueAtTime(0, time);
        noteGain.gain.linearRampToValueAtTime(0.12, time + 0.02);
        noteGain.gain.setValueAtTime(0.12, time + note.dur - 0.05);
        noteGain.gain.linearRampToValueAtTime(0, time + note.dur);

        osc.connect(noteGain);
        noteGain.connect(gainNode);

        osc.start(time);
        osc.stop(time + note.dur);

        currentOscillators.push(osc);
        time += note.dur;
    });

    // Loop the melody
    playbackTimeout = setTimeout(() => {
        if (isPlaying) {
            playMelody();
        }
    }, (time - audioContext.currentTime) * 1000 + 500);
}

export function stopMusic() {
    isPlaying = false;
    clearTimeout(playbackTimeout);
    currentOscillators.forEach((osc) => {
        try { osc.stop(); } catch (e) { /* already stopped */ }
    });
    currentOscillators = [];
}

export function isMusicPlaying() {
    return isPlaying;
}

