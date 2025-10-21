// enhancements.js - Timer Enhancements
// Adds color-coded warnings, sounds, and auto-scaling

(function() {
    'use strict';

    // Wait for DOM and timer to be ready
    window.addEventListener('DOMContentLoaded', () => {
        initEnhancements();
    });

    function initEnhancements() {
        // Initialize sound on first user interaction
        document.addEventListener('click', () => soundManager.init(), { once: true });
        document.addEventListener('keydown', () => soundManager.init(), { once: true });

        // Add sound controls to settings
        addSoundControls();

        // Hook into timer updates
        hookTimerUpdates();

        // Add auto-scaling based on text length
        addAutoScaling();

        // Add keyboard shortcuts for sound
        addSoundKeyboardShortcuts();
    }

    function addSoundControls() {
        // Find the appearance tab panel
        const appearancePanel = document.querySelector('[data-panel="appearance"]');
        if (!appearancePanel) return;

        const soundGroup = document.createElement('div');
        soundGroup.className = 'settings-group';
        soundGroup.innerHTML = `
            <h2>Ljud och notifikationer</h2>
            <div class="setting-row">
                <label>
                    <input type="checkbox" id="sound-enabled" checked>
                    Aktivera ljud
                </label>
            </div>
            <div class="setting-row">
                <label for="sound-volume">Volym:</label>
                <input type="range" id="sound-volume" min="0" max="100" value="50" style="flex: 1;">
                <span id="volume-display">50%</span>
            </div>
            <div class="setting-row">
                <label>
                    <input type="checkbox" id="sound-5min" checked>
                    Varning vid 5 min kvar
                </label>
            </div>
            <div class="setting-row">
                <label>
                    <input type="checkbox" id="sound-1min" checked>
                    Varning vid 1 min kvar
                </label>
            </div>
            <div class="setting-row">
                <label>
                    <input type="checkbox" id="sound-hourly">
                    Tim-signal (långa övningar)
                </label>
            </div>
        `;

        appearancePanel.appendChild(soundGroup);

        // Event listeners
        document.getElementById('sound-enabled').addEventListener('change', (e) => {
            soundManager.enabled = e.target.checked;
        });

        document.getElementById('sound-volume').addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            soundManager.setVolume(volume);
            document.getElementById('volume-display').textContent = e.target.value + '%';
        });
    }

    let lastHour = -1;
    let warned5Min = false;
    let warned1Min = false;

    function hookTimerUpdates() {
        // Override timer update to add color coding and sounds
        if (window.timer) {
            const originalOnUpdate = timer.onUpdate;
            const originalOnComplete = timer.onComplete;

            timer.onUpdate = function(timeString) {
                // Call original update
                if (originalOnUpdate) {
                    originalOnUpdate(timeString);
                }

                // Add color coding
                updateColorCoding();

                // Check for warnings
                checkTimerWarnings();
            };

            timer.onComplete = function() {
                // Play alarm sound
                if (document.getElementById('sound-enabled')?.checked) {
                    soundManager.alarmFinished();
                }

                // Reset warning flags
                warned5Min = false;
                warned1Min = false;
                lastHour = -1;

                // Call original complete
                if (originalOnComplete) {
                    originalOnComplete();
                }
            };
        }
    }

    function updateColorCoding() {
        const timerDisplay = document.getElementById('timer-time');
        const clockDisplay = document.getElementById('clock-time');

        if (!timerDisplay && !clockDisplay) return;

        const display = timerDisplay || clockDisplay;

        if (window.timer && timer.direction === 'down') {
            const remainingMs = timer.elapsedTime;
            const remainingSeconds = Math.floor(remainingMs / 1000);

            // Remove all status classes first
            display.classList.remove('status-green', 'status-yellow', 'status-red');

            // Add appropriate status class
            if (remainingSeconds > 300) {
                display.classList.add('status-green');
            } else if (remainingSeconds > 60) {
                display.classList.add('status-yellow');
            } else if (remainingSeconds > 0) {
                display.classList.add('status-red');
            }
        } else {
            // For count-up or clock, default to green
            display.classList.remove('status-yellow', 'status-red');
            display.classList.add('status-green');
        }
    }

    function checkTimerWarnings() {
        if (!window.timer || timer.direction !== 'down') return;

        const remainingMs = timer.elapsedTime;
        const remainingSeconds = Math.floor(remainingMs / 1000);
        const elapsedSeconds = Math.floor((timer.targetTime - remainingMs) / 1000);
        const currentHour = Math.floor(elapsedSeconds / 3600);

        // 5-minute warning
        if (remainingSeconds <= 300 && remainingSeconds > 299 && !warned5Min) {
            if (document.getElementById('sound-5min')?.checked) {
                soundManager.warning5Min();
            }
            warned5Min = true;
        }

        // 1-minute warning
        if (remainingSeconds <= 60 && remainingSeconds > 59 && !warned1Min) {
            if (document.getElementById('sound-1min')?.checked) {
                soundManager.warning1Min();
            }
            warned1Min = true;
        }

        // Hourly chime
        if (document.getElementById('sound-hourly')?.checked && currentHour > lastHour) {
            if (currentHour > 0) {
                soundManager.hourlyChime();
            }
            lastHour = currentHour;
        }

        // Reset warnings if time increases (restart)
        if (remainingSeconds > 300) {
            warned5Min = false;
        }
        if (remainingSeconds > 60) {
            warned1Min = false;
        }
    }

    function addAutoScaling() {
        // Auto-scale display based on text length
        const observer = new MutationObserver(() => {
            const timerDisplay = document.getElementById('timer-time');
            const clockDisplay = document.getElementById('clock-time');
            const display = timerDisplay || clockDisplay;

            if (!display) return;

            const textLength = display.textContent.length;

            // Adjust font size based on content length
            if (textLength <= 8) {
                // 00:00:00
                display.style.fontSize = 'min(50vh, 40vw)';
            } else if (textLength <= 10) {
                // 00:00:00.0
                display.style.fontSize = 'min(45vh, 35vw)';
            } else {
                // Longer strings
                display.style.fontSize = 'min(35vh, 28vw)';
            }
        });

        // Observe changes to timer/clock display
        setTimeout(() => {
            const timerTime = document.getElementById('timer-time');
            const clockTime = document.getElementById('clock-time');

            if (timerTime) {
                observer.observe(timerTime, { childList: true, characterData: true, subtree: true });
            }
            if (clockTime) {
                observer.observe(clockTime, { childList: true, characterData: true, subtree: true });
            }
        }, 1000);
    }

    function addSoundKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // M = Mute/Unmute
            if (e.key === 'm' || e.key === 'M') {
                const soundEnabled = document.getElementById('sound-enabled');
                if (soundEnabled) {
                    soundEnabled.checked = !soundEnabled.checked;
                    soundManager.enabled = soundEnabled.checked;

                    // Show feedback
                    showToast(soundManager.enabled ? 'Ljud aktiverat' : 'Ljud avstängt');
                }
            }
        });
    }

    function showToast(message) {
        // Simple toast notification
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 2rem;
            z-index: 10000;
            pointer-events: none;
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s';
            setTimeout(() => toast.remove(), 500);
        }, 1500);
    }

    // Export for debugging
    window.timerEnhancements = {
        updateColorCoding,
        checkTimerWarnings,
        showToast
    };
})();
