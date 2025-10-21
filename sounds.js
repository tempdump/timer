// sounds.js - Sound Manager for Timer Application
// Inspired by Stagetimer.io and Online-stopwatch.com

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.5;

        // Initialize on user interaction
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
        } catch (error) {
            console.warn('Web Audio API not supported:', error);
            this.enabled = false;
        }
    }

    /**
     * Play a beep sound
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in ms
     * @param {string} type - Oscillator type: 'sine', 'square', 'triangle', 'sawtooth'
     */
    async beep(frequency = 440, duration = 200, type = 'sine') {
        if (!this.enabled || !this.initialized) {
            await this.init();
        }

        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = type;

        gainNode.gain.setValueAtTime(this.volume, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration / 1000
        );

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    /**
     * 5-minute warning sound (gentle)
     */
    async warning5Min() {
        await this.beep(600, 150);
        setTimeout(() => this.beep(800, 150), 200);
    }

    /**
     * 1-minute warning sound (urgent)
     */
    async warning1Min() {
        for (let i = 0; i < 2; i++) {
            setTimeout(() => {
                this.beep(800, 100);
                setTimeout(() => this.beep(1000, 100), 120);
            }, i * 250);
        }
    }

    /**
     * Time's up alarm (dramatic)
     * Inspired by tactical/emergency alarms
     */
    async alarmFinished() {
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                this.beep(1200, 200, 'square');
                setTimeout(() => this.beep(900, 200, 'square'), 250);
            }, i * 500);
        }
    }

    /**
     * Hourly chime (for long exercises)
     */
    async hourlyChime() {
        await this.beep(880, 300);
        setTimeout(() => this.beep(1047, 300), 350);
        setTimeout(() => this.beep(1319, 400), 700);
    }

    /**
     * Tick sound (optional, for tactical feel)
     */
    async tick() {
        await this.beep(200, 10, 'square');
    }

    /**
     * Start/resume sound
     */
    async soundStart() {
        await this.beep(523, 100);
        setTimeout(() => this.beep(659, 100), 120);
        setTimeout(() => this.beep(784, 150), 240);
    }

    /**
     * Pause sound
     */
    async soundPause() {
        await this.beep(659, 150);
        setTimeout(() => this.beep(523, 200), 170);
    }

    /**
     * Stop sound
     */
    async soundStop() {
        await this.beep(784, 100);
        setTimeout(() => this.beep(523, 100), 120);
        setTimeout(() => this.beep(392, 200), 240);
    }

    /**
     * Toggle sound on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    /**
     * Set volume (0.0 to 1.0)
     */
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }
}

// Export singleton
const soundManager = new SoundManager();
