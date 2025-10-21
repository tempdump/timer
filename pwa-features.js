// PWA Features: Service Worker, Wake Lock, Fullscreen, Keyboard, Touch, Accessibility
// This file implements improvements 16-20

(function() {
    'use strict';

    // ===========================
    // 16. PWA IMPROVEMENTS
    // ===========================

    class PWAManager {
        constructor() {
            this.wakeLock = null;
            this.registration = null;
            this.updateAvailable = false;
        }

        async init() {
            // Register service worker
            if ('serviceWorker' in navigator) {
                try {
                    this.registration = await navigator.serviceWorker.register('./sw.js');
                    console.log('[PWA] Service Worker registered:', this.registration);

                    // Check for updates
                    this.registration.addEventListener('updatefound', () => {
                        const newWorker = this.registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                this.updateAvailable = true;
                                this.showUpdateNotification();
                            }
                        });
                    });
                } catch (error) {
                    console.error('[PWA] Service Worker registration failed:', error);
                }
            }

            // Request notification permission
            if ('Notification' in window && Notification.permission === 'default') {
                // Don't request immediately - wait for user interaction
                this.setupNotificationPrompt();
            }

            // Enable Wake Lock when timer is running
            this.setupWakeLock();

            // Install prompt
            this.setupInstallPrompt();
        }

        setupInstallPrompt() {
            let deferredPrompt;

            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;

                // Show install button
                this.showInstallButton(deferredPrompt);
            });

            window.addEventListener('appinstalled', () => {
                console.log('[PWA] App installed successfully');
                deferredPrompt = null;
            });
        }

        showInstallButton(deferredPrompt) {
            // Add install button to UI if not already installed
            if (!window.matchMedia('(display-mode: standalone)').matches) {
                const installBtn = document.createElement('button');
                installBtn.textContent = '📱 Installera app';
                installBtn.className = 'install-app-btn';
                installBtn.style.cssText = `
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    padding: 12px 24px;
                    background: #00ff00;
                    color: #000;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    z-index: 1000;
                    box-shadow: 0 4px 12px rgba(0,255,0,0.4);
                `;

                installBtn.addEventListener('click', async () => {
                    if (deferredPrompt) {
                        deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;
                        console.log('[PWA] Install prompt outcome:', outcome);
                        deferredPrompt = null;
                        installBtn.remove();
                    }
                });

                document.body.appendChild(installBtn);

                // Remove after 10 seconds if not clicked
                setTimeout(() => {
                    if (installBtn.parentNode) {
                        installBtn.style.opacity = '0';
                        installBtn.style.transition = 'opacity 0.5s';
                        setTimeout(() => installBtn.remove(), 500);
                    }
                }, 10000);
            }
        }

        showUpdateNotification() {
            const notification = document.createElement('div');
            notification.innerHTML = `
                <div style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                            background: rgba(0,0,0,0.95); color: #00ff00; padding: 16px 32px;
                            border-radius: 8px; z-index: 10000; box-shadow: 0 4px 12px rgba(0,255,0,0.3);">
                    <p style="margin: 0 0 10px 0;">Ny version tillgänglig!</p>
                    <button id="reload-btn" style="padding: 8px 16px; background: #00ff00; color: #000;
                                                     border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
                        Uppdatera nu
                    </button>
                </div>
            `;
            document.body.appendChild(notification);

            document.getElementById('reload-btn').addEventListener('click', () => {
                window.location.reload();
            });
        }

        setupNotificationPrompt() {
            // Show notification permission prompt when timer starts
            const originalStart = window.timer?.start;
            if (originalStart && window.timer) {
                window.timer.start = async function(...args) {
                    if (Notification.permission === 'default') {
                        const permission = await Notification.requestPermission();
                        console.log('[PWA] Notification permission:', permission);
                    }
                    return originalStart.apply(this, args);
                };
            }
        }

        async setupWakeLock() {
            if ('wakeLock' in navigator) {
                // Request wake lock when timer is running
                document.addEventListener('timerStateChange', async (e) => {
                    if (e.detail.running) {
                        await this.requestWakeLock();
                    } else {
                        await this.releaseWakeLock();
                    }
                });
            }
        }

        async requestWakeLock() {
            try {
                if ('wakeLock' in navigator && !this.wakeLock) {
                    this.wakeLock = await navigator.wakeLock.request('screen');
                    console.log('[PWA] Wake Lock acquired');

                    this.wakeLock.addEventListener('release', () => {
                        console.log('[PWA] Wake Lock released');
                    });
                }
            } catch (err) {
                console.error('[PWA] Wake Lock error:', err);
            }
        }

        async releaseWakeLock() {
            if (this.wakeLock) {
                await this.wakeLock.release();
                this.wakeLock = null;
            }
        }

        async sendNotification(title, body) {
            if (Notification.permission === 'granted') {
                if (this.registration && this.registration.showNotification) {
                    // Use service worker notification (works when tab is closed)
                    await this.registration.showNotification(title, {
                        body,
                        icon: './icon-192.png',
                        badge: './icon-192.png',
                        vibrate: [200, 100, 200],
                        tag: 'timer-complete',
                        requireInteraction: true
                    });
                } else {
                    // Fallback to regular notification
                    new Notification(title, {
                        body,
                        icon: './icon-192.png',
                        vibrate: [200, 100, 200]
                    });
                }
            }
        }
    }

    // ===========================
    // 17. FULLSCREEN API IMPROVEMENTS
    // ===========================

    class FullscreenManager {
        constructor() {
            this.isFullscreen = false;
            this.userPreference = localStorage.getItem('fullscreen-preference') || 'ask';
            this.hasShownInstructions = localStorage.getItem('fullscreen-instructions-shown') === 'true';
        }

        init() {
            // Listen for fullscreen changes
            document.addEventListener('fullscreenchange', () => {
                this.isFullscreen = !!document.fullscreenElement;
                this.updateUI();
            });

            // Show instructions first time
            if (!this.hasShownInstructions) {
                this.showFirstTimeInstructions();
            }

            // Add fullscreen toggle button to display
            this.addFullscreenToggle();
        }

        showFirstTimeInstructions() {
            const instructions = document.createElement('div');
            instructions.innerHTML = `
                <div id="fullscreen-instructions" style="position: fixed; inset: 0; background: rgba(0,0,0,0.95);
                                                          z-index: 10000; display: flex; align-items: center; justify-content: center;
                                                          color: #00ff00; font-size: 1.2rem; text-align: center; padding: 40px;">
                    <div>
                        <h2 style="margin-bottom: 20px;">Fullskärmsläge</h2>
                        <p style="margin-bottom: 15px;">För bästa upplevelse, använd fullskärmsläge.</p>
                        <p style="margin-bottom: 15px;"><strong>Kortkommandon:</strong></p>
                        <p style="margin-bottom: 10px;"><kbd style="background: #333; padding: 4px 8px; border-radius: 4px;">F</kbd> - Växla fullskärm</p>
                        <p style="margin-bottom: 10px;"><kbd style="background: #333; padding: 4px 8px; border-radius: 4px;">Esc</kbd> eller <kbd style="background: #333; padding: 4px 8px; border-radius: 4px;">F11</kbd> - Avsluta fullskärm</p>
                        <p style="margin-bottom: 30px; font-size: 0.9rem; color: #888;">Du kan även dubbelklicka på skärmen för fullskärm.</p>
                        <button id="got-it-btn" style="padding: 12px 32px; background: #00ff00; color: #000;
                                                        border: none; border-radius: 8px; font-size: 1.1rem;
                                                        cursor: pointer; font-weight: bold;">
                            Jag förstår
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(instructions);

            document.getElementById('got-it-btn').addEventListener('click', () => {
                instructions.remove();
                localStorage.setItem('fullscreen-instructions-shown', 'true');
                this.hasShownInstructions = true;
            });
        }

        addFullscreenToggle() {
            // Add fullscreen button that appears on hover in display mode
            const displayPanel = document.getElementById('display-panel');
            if (displayPanel) {
                const toggleBtn = document.createElement('button');
                toggleBtn.id = 'fullscreen-toggle';
                toggleBtn.innerHTML = '⛶';
                toggleBtn.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 50px;
                    height: 50px;
                    background: rgba(0,0,0,0.7);
                    color: #00ff00;
                    border: 2px solid #00ff00;
                    border-radius: 50%;
                    font-size: 1.5rem;
                    cursor: pointer;
                    opacity: 0;
                    transition: opacity 0.3s;
                    z-index: 1000;
                `;

                toggleBtn.addEventListener('click', () => this.toggle());

                displayPanel.appendChild(toggleBtn);

                // Show on mouse move
                let hideTimer;
                displayPanel.addEventListener('mousemove', () => {
                    toggleBtn.style.opacity = '1';
                    clearTimeout(hideTimer);
                    hideTimer = setTimeout(() => {
                        toggleBtn.style.opacity = '0';
                    }, 2000);
                });
            }
        }

        async toggle() {
            if (!document.fullscreenElement) {
                await this.enter();
            } else {
                await this.exit();
            }
        }

        async enter(element = document.documentElement) {
            try {
                if (element.requestFullscreen) {
                    await element.requestFullscreen();
                } else if (element.webkitRequestFullscreen) {
                    await element.webkitRequestFullscreen();
                } else if (element.msRequestFullscreen) {
                    await element.msRequestFullscreen();
                } else {
                    // Pseudo-fullscreen fallback
                    this.enterPseudoFullscreen(element);
                }

                // Remember preference
                localStorage.setItem('fullscreen-preference', 'always');
            } catch (err) {
                console.error('[Fullscreen] Error entering fullscreen:', err);
                // Try pseudo-fullscreen as fallback
                this.enterPseudoFullscreen(element);
            }
        }

        async exit() {
            try {
                if (document.exitFullscreen) {
                    await document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    await document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    await document.msExitFullscreen();
                } else {
                    this.exitPseudoFullscreen();
                }
            } catch (err) {
                console.error('[Fullscreen] Error exiting fullscreen:', err);
                this.exitPseudoFullscreen();
            }
        }

        enterPseudoFullscreen(element) {
            element.classList.add('pseudo-fullscreen');
            element.style.cssText = `
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                z-index: 9999 !important;
                background: #000 !important;
            `;
            this.isFullscreen = true;
            this.updateUI();
        }

        exitPseudoFullscreen() {
            const element = document.querySelector('.pseudo-fullscreen');
            if (element) {
                element.classList.remove('pseudo-fullscreen');
                element.style.cssText = '';
                this.isFullscreen = false;
                this.updateUI();
            }
        }

        updateUI() {
            const toggleBtn = document.getElementById('fullscreen-toggle');
            if (toggleBtn) {
                toggleBtn.innerHTML = this.isFullscreen ? '⛶' : '⛶';
                toggleBtn.setAttribute('aria-label', this.isFullscreen ? 'Avsluta fullskärm' : 'Fullskärm');
            }
        }
    }

    // ===========================
    // 18. EXTENDED KEYBOARD SHORTCUTS
    // ===========================

    class KeyboardShortcuts {
        constructor() {
            this.presets = this.loadPresets();
        }

        init() {
            document.addEventListener('keydown', (e) => this.handleKeyPress(e));
            console.log('[Keyboard] Shortcuts initialized');
        }

        handleKeyPress(e) {
            // Don't trigger if user is typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }

            const key = e.key.toLowerCase();
            const shift = e.shiftKey;
            const ctrl = e.ctrlKey;
            const alt = e.altKey;

            // +/- for 1 minute adjustment
            if ((key === '+' || key === '=') && !shift) {
                this.adjustTime(60);
                e.preventDefault();
            } else if (key === '-' && !shift) {
                this.adjustTime(-60);
                e.preventDefault();
            }

            // Shift +/- for 10 minute adjustment
            else if ((key === '+' || key === '=') && shift) {
                this.adjustTime(600);
                e.preventDefault();
            } else if (key === '_' || (key === '-' && shift)) {
                this.adjustTime(-600);
                e.preventDefault();
            }

            // T for theme toggle
            else if (key === 't' && !ctrl && !alt) {
                this.toggleTheme();
                e.preventDefault();
            }

            // F for fullscreen toggle
            else if (key === 'f' && !ctrl && !alt) {
                if (window.fullscreenManager) {
                    window.fullscreenManager.toggle();
                }
                e.preventDefault();
            }

            // S for save current time as preset (requires shift to avoid accidents)
            else if (key === 's' && shift && !ctrl) {
                this.saveCurrentAsPreset();
                e.preventDefault();
            }

            // 1-5 for load presets
            else if (['1', '2', '3', '4', '5'].includes(key) && !shift && !ctrl) {
                this.loadPreset(parseInt(key));
                e.preventDefault();
            }

            // M for mute (already handled in enhancements.js but we'll make sure)
            else if (key === 'm' && !ctrl && !alt) {
                // Handled by enhancements.js
            }
        }

        adjustTime(seconds) {
            // Only works in timer mode before starting
            const timerMode = document.getElementById('timer-mode');
            const displayPanel = document.getElementById('display-panel');

            if (!timerMode?.classList.contains('active') || !displayPanel?.classList.contains('hidden')) {
                // Timer is running or in clock mode
                return;
            }

            // Adjust the input fields
            const hoursInput = document.getElementById('hours');
            const minutesInput = document.getElementById('minutes');
            const secondsInput = document.getElementById('seconds');

            const currentTotal = (parseInt(hoursInput.value) || 0) * 3600 +
                                 (parseInt(minutesInput.value) || 0) * 60 +
                                 (parseInt(secondsInput.value) || 0);

            let newTotal = Math.max(0, currentTotal + seconds);

            const hours = Math.floor(newTotal / 3600);
            newTotal %= 3600;
            const minutes = Math.floor(newTotal / 60);
            const secs = newTotal % 60;

            hoursInput.value = hours;
            minutesInput.value = minutes;
            secondsInput.value = secs;

            // Update preview
            if (window.app && window.app.updatePreview) {
                window.app.updatePreview();
            }

            // Show feedback
            this.showKeyboardFeedback(seconds > 0 ? `+${seconds}s` : `${seconds}s`);
        }

        toggleTheme() {
            const themeButtons = document.querySelectorAll('.theme-btn');
            const activeIndex = Array.from(themeButtons).findIndex(btn => btn.classList.contains('active'));
            const nextIndex = (activeIndex + 1) % themeButtons.length;
            themeButtons[nextIndex].click();

            this.showKeyboardFeedback(`Tema: ${themeButtons[nextIndex].querySelector('span:last-child').textContent}`);
        }

        saveCurrentAsPreset() {
            const hoursInput = document.getElementById('hours');
            const minutesInput = document.getElementById('minutes');
            const secondsInput = document.getElementById('seconds');

            const time = {
                hours: parseInt(hoursInput.value) || 0,
                minutes: parseInt(minutesInput.value) || 0,
                seconds: parseInt(secondsInput.value) || 0
            };

            // Find next available preset slot
            let slot = 1;
            for (let i = 1; i <= 5; i++) {
                if (!this.presets[i]) {
                    slot = i;
                    break;
                }
            }

            this.presets[slot] = time;
            this.savePresets();

            this.showKeyboardFeedback(`Sparat i preset ${slot}`);
        }

        loadPreset(slot) {
            const preset = this.presets[slot];
            if (!preset) {
                this.showKeyboardFeedback(`Preset ${slot} är tom`);
                return;
            }

            const hoursInput = document.getElementById('hours');
            const minutesInput = document.getElementById('minutes');
            const secondsInput = document.getElementById('seconds');

            hoursInput.value = preset.hours;
            minutesInput.value = preset.minutes;
            secondsInput.value = preset.seconds;

            // Update preview
            if (window.app && window.app.updatePreview) {
                window.app.updatePreview();
            }

            const totalMins = preset.hours * 60 + preset.minutes;
            this.showKeyboardFeedback(`Preset ${slot}: ${totalMins}m ${preset.seconds}s`);
        }

        loadPresets() {
            const saved = localStorage.getItem('keyboard-presets');
            return saved ? JSON.parse(saved) : {};
        }

        savePresets() {
            localStorage.setItem('keyboard-presets', JSON.stringify(this.presets));
        }

        showKeyboardFeedback(message) {
            const feedback = document.createElement('div');
            feedback.textContent = message;
            feedback.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.9);
                color: #00ff00;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 1.2rem;
                z-index: 10001;
                box-shadow: 0 0 20px rgba(0,255,0,0.5);
                pointer-events: none;
            `;

            document.body.appendChild(feedback);

            setTimeout(() => {
                feedback.style.opacity = '0';
                feedback.style.transition = 'opacity 0.3s';
                setTimeout(() => feedback.remove(), 300);
            }, 1500);
        }
    }

    // ===========================
    // 19. TOUCH GESTURES (MOBILE)
    // ===========================

    class TouchGestures {
        constructor() {
            this.touchStartX = 0;
            this.touchStartY = 0;
            this.touchStartTime = 0;
            this.lastTap = 0;
            this.longPressTimer = null;
            this.pinchStartDistance = 0;
            this.currentScale = 1;
        }

        init() {
            const displayPanel = document.getElementById('display-panel');
            if (!displayPanel) return;

            // Touch events
            displayPanel.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
            displayPanel.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
            displayPanel.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });

            console.log('[Touch] Gestures initialized');
        }

        handleTouchStart(e) {
            if (e.touches.length === 1) {
                this.touchStartX = e.touches[0].clientX;
                this.touchStartY = e.touches[0].clientY;
                this.touchStartTime = Date.now();

                // Long press detection
                this.longPressTimer = setTimeout(() => {
                    this.handleLongPress();
                }, 800);
            } else if (e.touches.length === 2) {
                // Pinch gesture
                clearTimeout(this.longPressTimer);
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                this.pinchStartDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
            }
        }

        handleTouchMove(e) {
            clearTimeout(this.longPressTimer);

            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );

                if (this.pinchStartDistance > 0) {
                    const scale = currentDistance / this.pinchStartDistance;
                    this.handlePinch(scale);
                }
            }
        }

        handleTouchEnd(e) {
            clearTimeout(this.longPressTimer);

            if (e.changedTouches.length === 1 && e.touches.length === 0) {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const touchDuration = Date.now() - this.touchStartTime;

                const deltaX = touchEndX - this.touchStartX;
                const deltaY = touchEndY - this.touchStartY;

                // Swipe detection (must be quick and long enough)
                if (touchDuration < 500 && (Math.abs(deltaX) > 100 || Math.abs(deltaY) > 100)) {
                    if (Math.abs(deltaY) > Math.abs(deltaX)) {
                        if (deltaY < 0) {
                            this.handleSwipeUp();
                        } else {
                            this.handleSwipeDown();
                        }
                    }
                }
                // Double-tap detection
                else if (touchDuration < 300 && Math.abs(deltaX) < 10 && Math.abs(deltaY) < 10) {
                    const now = Date.now();
                    if (now - this.lastTap < 400) {
                        this.handleDoubleTap();
                    }
                    this.lastTap = now;
                }
            }

            this.pinchStartDistance = 0;
        }

        handleSwipeUp() {
            console.log('[Touch] Swipe up - Enter fullscreen');
            if (window.fullscreenManager) {
                window.fullscreenManager.enter();
            }
            this.showGestureFeedback('⬆️ Fullskärm');
        }

        handleSwipeDown() {
            console.log('[Touch] Swipe down - Exit fullscreen');
            if (window.fullscreenManager) {
                window.fullscreenManager.exit();
            }
            this.showGestureFeedback('⬇️ Avsluta fullskärm');
        }

        handleDoubleTap() {
            console.log('[Touch] Double tap - Pause/Resume');
            // Trigger space key (pause/resume)
            const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
            document.dispatchEvent(spaceEvent);
            this.showGestureFeedback('⏯️');
        }

        handleLongPress() {
            console.log('[Touch] Long press - Reset');
            // Trigger R key (reset)
            const rEvent = new KeyboardEvent('keydown', { key: 'r' });
            document.dispatchEvent(rEvent);
            this.showGestureFeedback('🔄 Återställ');
        }

        handlePinch(scale) {
            // Adjust display size based on pinch
            const displaySize = document.getElementById('display-size');
            if (!displaySize) return;

            const currentValue = parseInt(displaySize.value) || 75;
            const newValue = Math.min(100, Math.max(25, Math.round(currentValue * scale)));

            if (Math.abs(newValue - currentValue) >= 5) {
                displaySize.value = newValue;
                displaySize.dispatchEvent(new Event('change'));
                this.currentScale = 1;
                this.pinchStartDistance = 0;

                this.showGestureFeedback(`🔍 ${newValue}%`);
            }
        }

        showGestureFeedback(message) {
            const feedback = document.createElement('div');
            feedback.textContent = message;
            feedback.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.9);
                color: #00ff00;
                padding: 20px 40px;
                border-radius: 12px;
                font-size: 2rem;
                z-index: 10002;
                box-shadow: 0 0 30px rgba(0,255,0,0.5);
                pointer-events: none;
            `;

            document.body.appendChild(feedback);

            setTimeout(() => {
                feedback.style.opacity = '0';
                feedback.style.transition = 'opacity 0.3s';
                setTimeout(() => feedback.remove(), 300);
            }, 1000);
        }
    }

    // ===========================
    // 20. ACCESSIBILITY IMPROVEMENTS
    // ===========================

    class AccessibilityManager {
        constructor() {
            this.highContrastMode = localStorage.getItem('high-contrast') === 'true';
            this.textScale = parseFloat(localStorage.getItem('text-scale')) || 1;
        }

        init() {
            this.addARIALabels();
            this.addAccessibilityControls();
            this.improveKeyboardNavigation();
            this.addVisualIndicators();

            if (this.highContrastMode) {
                this.enableHighContrast();
            }

            this.applyTextScale();

            console.log('[Accessibility] Features initialized');
        }

        addARIALabels() {
            // Add ARIA labels to all interactive elements
            const elements = [
                { id: 'start-btn', label: 'Starta timer i fullskärm' },
                { id: 'timer-mode', label: 'Välj timer-läge' },
                { id: 'clock-mode', label: 'Välj klock-läge' },
                { id: 'timer-time', role: 'timer', live: 'polite' },
                { id: 'clock-time', role: 'timer', live: 'polite' },
                { id: 'help-indicator', label: 'Visa hjälp och kortkommandon' }
            ];

            elements.forEach(({ id, label, role, live }) => {
                const element = document.getElementById(id);
                if (element) {
                    if (label) element.setAttribute('aria-label', label);
                    if (role) element.setAttribute('role', role);
                    if (live) element.setAttribute('aria-live', live);
                }
            });

            // Add labels to theme buttons
            document.querySelectorAll('.theme-btn').forEach((btn) => {
                const themeName = btn.querySelector('span:last-child')?.textContent;
                if (themeName) {
                    btn.setAttribute('aria-label', `Välj tema: ${themeName}`);
                }
            });

            // Add labels to preset buttons
            document.querySelectorAll('.preset-btn').forEach((btn, index) => {
                btn.setAttribute('aria-label', `Förinställning ${index + 1}`);
            });
        }

        addAccessibilityControls() {
            const appearancePanel = document.querySelector('[data-panel="appearance"]');
            if (!appearancePanel) return;

            const accessibilityGroup = document.createElement('div');
            accessibilityGroup.className = 'settings-group';
            accessibilityGroup.innerHTML = `
                <h2>Tillgänglighet</h2>
                <div class="setting-row">
                    <label>
                        <input type="checkbox" id="high-contrast-toggle" ${this.highContrastMode ? 'checked' : ''}>
                        Högkontrast-läge
                    </label>
                </div>
                <div class="setting-row">
                    <label for="text-scale-slider">Textstorlek:</label>
                    <input type="range" id="text-scale-slider" min="0.8" max="1.5" step="0.1" value="${this.textScale}" style="flex: 1;">
                    <span id="text-scale-display">${Math.round(this.textScale * 100)}%</span>
                </div>
                <div class="setting-row">
                    <label>
                        <input type="checkbox" id="reduce-motion" ${window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'checked' : ''}>
                        Reducera animationer
                    </label>
                </div>
                <div class="setting-row">
                    <label>
                        <input type="checkbox" id="screen-reader-mode">
                        Skärmläsarläge (extra info)
                    </label>
                </div>
            `;

            appearancePanel.appendChild(accessibilityGroup);

            // Event listeners
            document.getElementById('high-contrast-toggle')?.addEventListener('change', (e) => {
                this.highContrastMode = e.target.checked;
                localStorage.setItem('high-contrast', this.highContrastMode);
                if (this.highContrastMode) {
                    this.enableHighContrast();
                } else {
                    this.disableHighContrast();
                }
            });

            document.getElementById('text-scale-slider')?.addEventListener('input', (e) => {
                this.textScale = parseFloat(e.target.value);
                document.getElementById('text-scale-display').textContent = Math.round(this.textScale * 100) + '%';
                localStorage.setItem('text-scale', this.textScale);
                this.applyTextScale();
            });

            document.getElementById('reduce-motion')?.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.documentElement.style.setProperty('--animation-duration', '0s');
                } else {
                    document.documentElement.style.setProperty('--animation-duration', '1s');
                }
            });
        }

        enableHighContrast() {
            document.body.classList.add('high-contrast');

            const style = document.createElement('style');
            style.id = 'high-contrast-style';
            style.textContent = `
                .high-contrast {
                    --status-green: #00ff00 !important;
                    --status-yellow: #ffff00 !important;
                    --status-red: #ff0000 !important;
                }

                .high-contrast .status-green {
                    color: #00ff00 !important;
                    text-shadow: 0 0 20px #00ff00 !important;
                    border: 3px solid #00ff00 !important;
                }

                .high-contrast .status-yellow {
                    color: #ffff00 !important;
                    text-shadow: 0 0 20px #ffff00 !important;
                    border: 3px solid #ffff00 !important;
                }

                .high-contrast .status-red {
                    color: #ff0000 !important;
                    text-shadow: 0 0 20px #ff0000 !important;
                    border: 3px solid #ff0000 !important;
                }

                .high-contrast button:focus,
                .high-contrast input:focus,
                .high-contrast select:focus {
                    outline: 3px solid #00ff00 !important;
                    outline-offset: 2px !important;
                }
            `;

            document.head.appendChild(style);
        }

        disableHighContrast() {
            document.body.classList.remove('high-contrast');
            const style = document.getElementById('high-contrast-style');
            if (style) style.remove();
        }

        applyTextScale() {
            document.documentElement.style.setProperty('--text-scale', this.textScale);

            // Apply to specific elements that need scaling
            const scalableElements = document.querySelectorAll('.settings-panel, .display-panel');
            scalableElements.forEach(el => {
                el.style.fontSize = `calc(1rem * ${this.textScale})`;
            });
        }

        improveKeyboardNavigation() {
            // Add visible focus indicators
            const style = document.createElement('style');
            style.textContent = `
                button:focus-visible,
                input:focus-visible,
                select:focus-visible,
                .theme-btn:focus-visible,
                .preset-btn:focus-visible {
                    outline: 2px solid #00ff00 !important;
                    outline-offset: 2px !important;
                    box-shadow: 0 0 10px rgba(0,255,0,0.5) !important;
                }

                .settings-tab:focus-visible {
                    background: #00ff00 !important;
                    color: #000 !important;
                }
            `;
            document.head.appendChild(style);

            // Make all theme buttons keyboard accessible
            document.querySelectorAll('.theme-btn').forEach((btn, index) => {
                btn.setAttribute('tabindex', '0');
                btn.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        btn.click();
                    }
                });
            });
        }

        addVisualIndicators() {
            // Add icons to color-coded statuses
            const updateWithIcon = () => {
                const timerDisplay = document.getElementById('timer-time');
                if (!timerDisplay) return;

                // Remove existing icons
                const existingIcon = timerDisplay.querySelector('.status-icon');
                if (existingIcon) existingIcon.remove();

                let icon = '';
                if (timerDisplay.classList.contains('status-green')) {
                    icon = '✓'; // Check mark
                } else if (timerDisplay.classList.contains('status-yellow')) {
                    icon = '⚠'; // Warning
                } else if (timerDisplay.classList.contains('status-red')) {
                    icon = '⚠'; // Urgent warning
                }

                if (icon) {
                    const iconSpan = document.createElement('span');
                    iconSpan.className = 'status-icon';
                    iconSpan.textContent = icon;
                    iconSpan.style.cssText = `
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        font-size: 3rem;
                        opacity: 0.8;
                    `;
                    timerDisplay.style.position = 'relative';
                    timerDisplay.appendChild(iconSpan);
                }
            };

            // Observe class changes
            const observer = new MutationObserver(updateWithIcon);
            const timerDisplay = document.getElementById('timer-time');
            if (timerDisplay) {
                observer.observe(timerDisplay, { attributes: true, attributeFilter: ['class'] });
            }
        }
    }

    // ===========================
    // INITIALIZATION
    // ===========================

    window.addEventListener('DOMContentLoaded', () => {
        console.log('[PWA Features] Initializing...');

        // Initialize all managers
        window.pwaManager = new PWAManager();
        window.fullscreenManager = new FullscreenManager();
        window.keyboardShortcuts = new KeyboardShortcuts();
        window.touchGestures = new TouchGestures();
        window.accessibilityManager = new AccessibilityManager();

        // Initialize in sequence
        window.pwaManager.init();
        window.fullscreenManager.init();
        window.keyboardShortcuts.init();
        window.touchGestures.init();
        window.accessibilityManager.init();

        console.log('[PWA Features] All features initialized successfully!');

        // Hook into timer completion to send notification
        if (window.timer) {
            const originalOnComplete = timer.onComplete;
            timer.onComplete = function() {
                // Send PWA notification
                if (window.pwaManager) {
                    window.pwaManager.sendNotification(
                        'Timer färdig!',
                        'Din nedräkningstimer har nått noll.'
                    );
                }

                if (originalOnComplete) {
                    originalOnComplete.call(this);
                }
            };
        }
    });

    // Export for debugging
    window.pwaFeatures = {
        PWAManager,
        FullscreenManager,
        KeyboardShortcuts,
        TouchGestures,
        AccessibilityManager
    };
})();
