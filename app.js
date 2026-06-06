/* ==========================================================================
   ZenFocus Interactive Logic & Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. Background Particle System
    initParticles();

    // 2. Pomodoro Timer
    initPomodoro();

    // 3. Deadline Countdown
    initDeadlineCountdown();

    // 4. Interactive Tasks Manager
    initTaskManager();

    // 5. Interactive SVG Chart Hover Effects
    initWeeklyChart();

    // 6. Navigation Link Triggers
    initNavigation();
});

/* ==========================================================================
   1. Starry Canvas Particle System
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 40;
    
    // Resize Canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle Object
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.15;
            this.speedY = (Math.random() - 0.5) * 0.15;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.glow = Math.random() > 0.8; // some particles glow brighter
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Warp around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            if (this.glow) {
                ctx.shadowBlur = 8;
                ctx.shadowColor = '#8b5cf6';
            } else {
                ctx.shadowBlur = 0;
            }
            ctx.fill();
        }
    }

    // Initialize Particle Array
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Animation Loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();
}

/* ==========================================================================
   2. Pomodoro Timer Logic
   ========================================================================== */
function initPomodoro() {
    const timerTime = document.getElementById('timer-time');
    const timerState = document.getElementById('timer-state');
    const timerProgress = document.getElementById('timer-progress');
    const btnToggle = document.getElementById('timer-toggle');
    const btnToggleText = document.getElementById('timer-toggle-text');
    const btnReset = document.getElementById('timer-reset');
    const modeButtons = document.querySelectorAll('.timer-mode-btn');
    const audioToggle = document.getElementById('audio-toggle');
    const alertSound = document.getElementById('alert-sound');

    // Timer variables
    let totalSeconds = 25 * 60;
    let elapsedSeconds = 0;
    let timerInterval = null;
    let isRunning = false;
    let currentMode = 'pomodoro'; // 'pomodoro', 'short', 'long'
    let isAudioEnabled = true;

    // SVG Circumference calculation (r = 95)
    // 2 * PI * r = 2 * 3.14159 * 95 = 596.9
    const circleCircumference = 596.9;

    // Map modes to durations in minutes
    const modeDurations = {
        pomodoro: 25,
        short: 5,
        long: 15
    };

    const modeLabels = {
        pomodoro: 'Time to Focus',
        short: 'Take a Short Break',
        long: 'Take a Long Break'
    };

    function updateDisplay() {
        const remainingSeconds = totalSeconds - elapsedSeconds;
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        
        // Update Time text
        const displayTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        timerTime.textContent = displayTime;

        // Update Document Title
        if (isRunning) {
            document.title = `(${displayTime}) ZenFocus — Focusing`;
        } else {
            document.title = `ZenFocus — Elevate Your Study & Focus Habits`;
        }

        // Update SVG Progress
        const progressPercent = elapsedSeconds / totalSeconds;
        const offset = progressPercent * circleCircumference;
        timerProgress.style.strokeDashoffset = offset;

        // Timer finished
        if (remainingSeconds <= 0) {
            timerFinished();
        }
    }

    function toggleTimer() {
        if (isRunning) {
            // Pause
            clearInterval(timerInterval);
            isRunning = false;
            btnToggleText.textContent = 'Resume Focus';
            btnToggle.querySelector('.play-icon').classList.remove('hidden');
            btnToggle.querySelector('.pause-icon').classList.add('hidden');
            timerState.textContent = 'Focus Paused';
        } else {
            // Play
            isRunning = true;
            btnToggleText.textContent = 'Pause Focus';
            btnToggle.querySelector('.play-icon').classList.add('hidden');
            btnToggle.querySelector('.pause-icon').classList.remove('hidden');
            timerState.textContent = modeLabels[currentMode];
            
            timerInterval = setInterval(() => {
                elapsedSeconds++;
                updateDisplay();
            }, 1000);
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        elapsedSeconds = 0;
        btnToggleText.textContent = 'Start Focus';
        btnToggle.querySelector('.play-icon').classList.remove('hidden');
        btnToggle.querySelector('.pause-icon').classList.add('hidden');
        timerState.textContent = 'Ready to Focus';
        updateDisplay();
    }

    function changeMode(mode) {
        currentMode = mode;
        totalSeconds = modeDurations[mode] * 60;
        
        // Update SVG color depending on mode
        if (mode === 'pomodoro') {
            timerProgress.style.stroke = 'var(--color-primary)';
            timerProgress.style.filter = 'drop-shadow(0 0 6px var(--color-primary-glow))';
        } else if (mode === 'short') {
            timerProgress.style.stroke = 'var(--color-accent)';
            timerProgress.style.filter = 'drop-shadow(0 0 6px var(--color-accent-glow))';
        } else {
            timerProgress.style.stroke = 'var(--color-secondary)';
            timerProgress.style.filter = 'drop-shadow(0 0 6px var(--color-secondary-glow))';
        }

        // Apply active class to buttons
        modeButtons.forEach(btn => {
            if (btn.dataset.mode === mode) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        resetTimer();
    }

    function timerFinished() {
        clearInterval(timerInterval);
        isRunning = false;
        
        if (isAudioEnabled && alertSound) {
            alertSound.play().catch(e => console.log('Audio playback blocked: ', e));
        }

        // Trigger subtle browser notifications or alerts
        alert(`Focus Session Finished! Time for a well-deserved break.`);
        
        // Auto-switch mode
        if (currentMode === 'pomodoro') {
            changeMode('short');
        } else {
            changeMode('pomodoro');
        }
    }

    // Toggle Audio
    audioToggle.addEventListener('click', () => {
        isAudioEnabled = !isAudioEnabled;
        audioToggle.querySelector('.vol-on-icon').classList.toggle('hidden');
        audioToggle.querySelector('.vol-off-icon').classList.toggle('hidden');
    });

    // Event listeners
    btnToggle.addEventListener('click', toggleTimer);
    btnReset.addEventListener('click', resetTimer);

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            changeMode(button.dataset.mode);
        });
    });

    // Initial setup
    changeMode('pomodoro');
}

/* ==========================================================================
   3. Deadline Countdown Logic
   ========================================================================== */
function initDeadlineCountdown() {
    const dlHours = document.getElementById('dl-hours');
    const dlMins = document.getElementById('dl-mins');
    const dlSecs = document.getElementById('dl-secs');

    if (!dlHours || !dlMins || !dlSecs) return;

    // Set deadline target dynamically: Tomorrow at 11:59:00 PM
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(23, 59, 0, 0);

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate.getTime() - now;

        if (difference <= 0) {
            dlHours.textContent = '00';
            dlMins.textContent = '00';
            dlSecs.textContent = '00';
            return;
        }

        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        dlHours.textContent = String(hours).padStart(2, '0');
        dlMins.textContent = String(minutes).padStart(2, '0');
        dlSecs.textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* ==========================================================================
   4. Tasks Management Logic
   ========================================================================== */
function initTaskManager() {
    const tasksList = document.getElementById('tasks-list');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskInputWrapper = document.getElementById('task-input-wrapper');
    const taskInput = document.getElementById('task-input');
    const taskSubmitBtn = document.getElementById('task-submit-btn');
    const tasksDropdownLink = document.getElementById('tasks-dropdown-link');

    if (!tasksList) return;

    // Update the Profile Menu tasks count badge dynamically
    function updateBadgeCount() {
        if (!tasksDropdownLink) return;
        const activeTasks = tasksList.querySelectorAll('.task-item:not(.completed)').length;
        let badge = tasksDropdownLink.querySelector('.badge');
        
        // Remove or add/modify badge
        if (activeTasks === 0) {
            if (badge) badge.remove();
        } else {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'badge badge-purple';
                tasksDropdownLink.appendChild(badge);
            }
            badge.textContent = activeTasks;
        }
    }

    // Initial item checkboxes attachment
    function setupCheckboxListeners() {
        const checkBoxes = tasksList.querySelectorAll('.task-checkbox');
        checkBoxes.forEach(box => {
            const item = box.closest('.task-item');
            
            // Initial class setting
            if (box.checked) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }

            // Click listener
            box.onchange = () => {
                if (box.checked) {
                    item.classList.add('completed');
                } else {
                    item.classList.remove('completed');
                }
                updateBadgeCount();
            };
        });
    }

    setupCheckboxListeners();
    updateBadgeCount();

    // Toggle Input visibility
    addTaskBtn.addEventListener('click', () => {
        taskInputWrapper.classList.toggle('hidden');
        if (!taskInputWrapper.classList.contains('hidden')) {
            taskInput.focus();
        }
    });

    // Submit Task Function
    function submitTask() {
        const text = taskInput.value.trim();
        if (text === '') return;

        // Tags randomized for premium showcase visual variety
        const tags = ['high', 'medium', 'low'];
        const randomTag = tags[Math.floor(Math.random() * tags.length)];
        const tagLabel = randomTag.charAt(0).toUpperCase() + randomTag.slice(1);

        const newLi = document.createElement('li');
        newLi.className = 'task-item';
        newLi.innerHTML = `
            <label class="task-checkbox-wrapper">
                <input type="checkbox" class="task-checkbox">
                <span class="task-custom-checkbox"><i data-lucide="check" class="check-icon"></i></span>
                <span class="task-text">${escapeHtml(text)}</span>
            </label>
            <span class="task-tag tag-${randomTag}">${tagLabel}</span>
        `;

        tasksList.appendChild(newLi);
        taskInput.value = '';
        taskInputWrapper.classList.add('hidden');
        
        // Re-init lucide icons inside the new list item
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        setupCheckboxListeners();
        updateBadgeCount();
    }

    // Submit trigger on button click
    taskSubmitBtn.addEventListener('click', submitTask);

    // Submit trigger on Enter key press
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitTask();
        }
    });
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/* ==========================================================================
   5. Interactive SVG Weekly Chart Hover Effects
   ========================================================================== */
function initWeeklyChart() {
    const bars = document.querySelectorAll('.chart-bar');
    const dayHours = [5.0, 6.2, 4.0, 7.5, 5.2, 5.5, 0.0];
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday (Today)', 'Sunday'];

    bars.forEach((bar, idx) => {
        bar.addEventListener('mouseenter', (e) => {
            const card = bar.closest('.stat-card');
            const detailsDesc = card.querySelector('.stat-desc');
            const statNum = card.querySelector('.stat-num');
            
            if (statNum) {
                statNum.innerHTML = `${dayHours[idx].toFixed(1)} <span class="stat-unit">hrs</span>`;
            }
            if (detailsDesc) {
                detailsDesc.textContent = `Focused on ${days[idx]}`;
                detailsDesc.style.color = 'var(--color-accent)';
            }
        });

        bar.addEventListener('mouseleave', (e) => {
            const card = bar.closest('.stat-card');
            const detailsDesc = card.querySelector('.stat-desc');
            const statNum = card.querySelector('.stat-num');
            
            if (statNum) {
                statNum.innerHTML = `32.4 <span class="stat-unit">hrs total</span>`;
            }
            if (detailsDesc) {
                detailsDesc.textContent = 'Up +14% compared to last week';
                detailsDesc.style.color = '';
            }
        });
    });
}

/* ==========================================================================
   6. Navigation Link Triggers & Scroll behavior
   ========================================================================== */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Global Scroll helper for buttons
window.scrollToSection = function(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        
        // Highlight active tab
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
};

