/* ==========================================================================
   ZenFocus Interactive Logic & Animations
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize State
    initState();

    // 2. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 3. Background Particle System
    initParticles();

    // 4. Toast System & Common Modal Handlers
    initGlobalUI();

    // 5. Pomodoro Timer
    initPomodoro();

    // 6. Deadline Countdown
    initDeadlineCountdown();

    // 7. Interactive Tasks Manager
    initTaskManager();

    // 8. Weekly Chart
    initWeeklyChart();

    // 9. Navigation
    initNavigation();

    // 10. Special Pages Subsystems
    initCommunityPage();
    initResourcesPage();
    initRoomsPage();
});

/* ==========================================================================
   State Management & Initialization
   ========================================================================== */
const DEFAULT_STATE = {
    user: {
        name: "Alex Rivera",
        email: "alex.rivera@svnit.ac.in",
        isLoggedIn: true,
        xp: 1250
    },
    settings: {
        pomodoro: 25,
        short: 5,
        long: 15,
        goal: 8,
        sound: "rainforest",
        volume: true
    },
    tasks: [
        { id: 1, text: "Revise Lecture 12-14 of Machine Learning", completed: true, tag: "high" },
        { id: 2, text: "Write PyTorch Training Loop for CNN", completed: false, tag: "medium" },
        { id: 3, text: "Read Atomic Habits Chapter 4", completed: false, tag: "low" }
    ],
    cart: [
        { id: "premium-yearly", name: "ZenFocus Premium Yearly", price: 29.99 },
        { id: "sound-rainforest", name: "Focus Sound Pack - Rainforest", price: 4.99 }
    ],
    analytics: {
        Monday: 5.0,
        Tuesday: 6.2,
        Wednesday: 4.0,
        Thursday: 7.5,
        Friday: 5.2,
        Saturday: 5.5,
        Sunday: 0.0
    },
    streak: 12,
    notifications: [
        { id: 1, text: "Machine Learning Competition deadline is tomorrow at 11:59 PM!", time: "1 hour ago", unread: true }
    ]
};

function initState() {
    if (!localStorage.getItem("zenfocus_state_initialized")) {
        localStorage.setItem("zenfocus_user", JSON.stringify(DEFAULT_STATE.user));
        localStorage.setItem("zenfocus_settings", JSON.stringify(DEFAULT_STATE.settings));
        localStorage.setItem("zenfocus_tasks", JSON.stringify(DEFAULT_STATE.tasks));
        localStorage.setItem("zenfocus_cart", JSON.stringify(DEFAULT_STATE.cart));
        localStorage.setItem("zenfocus_analytics", JSON.stringify(DEFAULT_STATE.analytics));
        localStorage.setItem("zenfocus_streak", DEFAULT_STATE.streak.toString());
        localStorage.setItem("zenfocus_notifications", JSON.stringify(DEFAULT_STATE.notifications));
        localStorage.setItem("zenfocus_state_initialized", "true");
        
    }
}

function getStored(key, defaultVal) {
    const data = localStorage.getItem(key);
    if (!data) return defaultVal;
    try {
        return JSON.parse(data);
    } catch(e) {
        return data;
    }
}

function saveStored(key, val) {
    if (typeof val === 'object') {
        localStorage.setItem(key, JSON.stringify(val));
    } else {
        localStorage.setItem(key, val.toString());
    }
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast-item glass-card ${type}`;

    let icon = 'info';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'alert-triangle';
    if (type === 'error') icon = 'x-circle';

    toast.innerHTML = `
        <i data-lucide="${icon}"></i>
        <div style="flex: 1; font-size: 0.85rem;">${message}</div>
        <div class="toast-progress"></div>
    `;
    container.appendChild(toast);
    
    if (typeof lucide !== 'undefined') {
        lucide.createIcons({ attrs: { class: 'nav-icon text-' + (type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'cyan') } });
    }

    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ==========================================================================
   1. Starry Canvas Particle System
   ========================================================================== */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    const particleCount = 40;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.15;
            this.speedY = (Math.random() - 0.5) * 0.15;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.glow = Math.random() > 0.8;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

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

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

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
   Global UI Components (Modals, Dropdowns, Cart, Auth)
   ========================================================================== */
function initGlobalUI() {
    // A. Sync profile visual states
    const user = getStored("zenfocus_user", DEFAULT_STATE.user);
    const names = document.querySelectorAll('.user-name');
    const emails = document.querySelectorAll('.user-email');
    const xpVals = document.querySelectorAll('#profile-xp-val');
    const xpBadge = document.querySelector('.points-value');

    names.forEach(n => n.textContent = user.name);
    emails.forEach(e => e.textContent = user.email);
    if (xpBadge) xpBadge.textContent = `${user.xp} XP`;
    xpVals.forEach(v => v.textContent = `${user.xp} XP`);

    // Logout
    const logoutTriggers = document.querySelectorAll('#logout-trigger, a[href="#logout"]');
    logoutTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            user.isLoggedIn = false;
            saveStored("zenfocus_user", user);
            showToast("Logged out successfully.", "info");
            openAuthModal();
        });
    });

    // B. Notifications System
    const notifBtn = document.getElementById('notification-btn');
    const notifList = document.getElementById('notification-list');
    const notifBadge = document.querySelector('.notification-badge');
    const markReadBtn = document.getElementById('mark-read-btn');

    function renderNotifications() {
        if (!notifList) return;
        const list = getStored("zenfocus_notifications", DEFAULT_STATE.notifications);
        notifList.innerHTML = "";
        
        let unreadCount = 0;
        list.forEach(n => {
            if (n.unread) unreadCount++;
            const item = document.createElement('li');
            item.className = `notification-item ${n.unread ? 'unread' : ''}`;
            item.innerHTML = `
                <div class="notification-info">
                    <span class="notification-text">${n.text}</span>
                    <span class="notification-time">${n.time}</span>
                </div>
            `;
            notifList.appendChild(item);
        });

        if (notifBadge) {
            notifBadge.textContent = unreadCount;
            notifBadge.style.display = unreadCount === 0 ? "none" : "flex";
        }
    }

    if (markReadBtn) {
        markReadBtn.addEventListener('click', () => {
            const list = getStored("zenfocus_notifications", DEFAULT_STATE.notifications);
            list.forEach(n => n.unread = false);
            saveStored("zenfocus_notifications", list);
            renderNotifications();
            showToast("All notifications marked as read.", "success");
        });
    }
    renderNotifications();

    // C. Shopping Cart Actions
    const cartItemsList = document.getElementById('cart-items-list');
    const cartBadge = document.querySelector('.cart-badge');
    const cartCountText = document.querySelector('.cart-items-count');
    const cartTotalAmount = document.getElementById('cart-total-amount');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

    function renderCart() {
        const cart = getStored("zenfocus_cart", DEFAULT_STATE.cart);
        if (cartBadge) {
            cartBadge.textContent = cart.length;
            cartBadge.style.display = cart.length === 0 ? "none" : "flex";
        }
        if (cartCountText) {
            cartCountText.textContent = `${cart.length} Item${cart.length !== 1 ? 's' : ''}`;
        }

        if (!cartItemsList) return;
        cartItemsList.innerHTML = "";

        if (cart.length === 0) {
            cartItemsList.innerHTML = `<li class="cart-item" style="color: var(--color-text-secondary); text-align: center; justify-content: center; padding: 16px 0;">Your cart is empty.</li>`;
            if (cartTotalAmount) cartTotalAmount.textContent = "$0.00";
            return;
        }

        let total = 0;
        cart.forEach(item => {
            total += item.price;
            const li = document.createElement('li');
            li.className = "cart-item";
            li.innerHTML = `
                <div class="cart-item-info">
                    <span class="cart-item-name">${item.name}</span>
                    <span class="cart-item-price">$${item.price.toFixed(2)}</span>
                </div>
                <button class="cart-item-remove" data-id="${item.id}" title="Remove"><i data-lucide="trash-2"></i></button>
            `;
            cartItemsList.appendChild(li);
        });

        if (cartTotalAmount) cartTotalAmount.textContent = `$${total.toFixed(2)}`;
        
        // Remove item logic
        cartItemsList.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = btn.getAttribute('data-id');
                let curCart = getStored("zenfocus_cart", DEFAULT_STATE.cart);
                curCart = curCart.filter(item => item.id !== id);
                saveStored("zenfocus_cart", curCart);
                renderCart();
                showToast("Item removed from cart.", "info");
            });
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    renderCart();

    // D. Modal Overlay Toggles
    const settingsModal = document.getElementById('settings-modal');
    const settingsTrigger = document.getElementById('settings-trigger');
    const settingsClose = document.getElementById('settings-close-btn');
    const settingsForm = document.getElementById('settings-form');

    const authModal = document.getElementById('auth-modal');
    const authClose = document.getElementById('auth-close-btn');
    const authForm = document.getElementById('auth-form');

    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutClose = document.getElementById('checkout-close-btn');
    const checkoutForm = document.getElementById('checkout-form');

    // Settings Modal
    if (settingsTrigger && settingsModal) {
        settingsTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            const config = getStored("zenfocus_settings", DEFAULT_STATE.settings);
            document.getElementById('setting-pomodoro').value = config.pomodoro;
            document.getElementById('setting-short').value = config.short;
            document.getElementById('setting-long').value = config.long;
            document.getElementById('setting-goal').value = config.goal;
            document.getElementById('setting-sound').value = config.sound;
            document.getElementById('setting-volume').checked = config.volume;
            
            settingsModal.classList.add('active');
        });
    }

    if (settingsClose) settingsClose.addEventListener('click', () => settingsModal.classList.remove('active'));
    
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const config = {
                pomodoro: parseInt(document.getElementById('setting-pomodoro').value),
                short: parseInt(document.getElementById('setting-short').value),
                long: parseInt(document.getElementById('setting-long').value),
                goal: parseInt(document.getElementById('setting-goal').value),
                sound: document.getElementById('setting-sound').value,
                volume: document.getElementById('setting-volume').checked
            };
            saveStored("zenfocus_settings", config);
            settingsModal.classList.remove('active');
            
            // Reload settings in active page instance
            if (window.timerReloadSettings) {
                window.timerReloadSettings();
            }

            showToast("Focus configurations updated.", "success");
        });
    }

    // Auth Modal
    function openAuthModal() {
        if (authModal) authModal.classList.add('active');
    }
    if (authClose) authClose.addEventListener('click', () => authModal.classList.remove('active'));
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('auth-email').value;
            user.name = email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
            user.email = email;
            user.isLoggedIn = true;
            saveStored("zenfocus_user", user);
            
            names.forEach(n => n.textContent = user.name);
            emails.forEach(e => e.textContent = user.email);

            authModal.classList.remove('active');
            showToast(`Welcome back, ${user.name}!`, "success");
        });
    }

    // Checkout
    if (cartCheckoutBtn && checkoutModal) {
        cartCheckoutBtn.addEventListener('click', () => {
            const cart = getStored("zenfocus_cart", DEFAULT_STATE.cart);
            if (cart.length === 0) {
                showToast("Please add items to cart first.", "warning");
                return;
            }

            // Populate checkout summary
            const summaryList = document.getElementById('checkout-items-summary');
            const totalVal = document.getElementById('checkout-total-val');
            summaryList.innerHTML = "";
            let sum = 0;
            cart.forEach(item => {
                sum += item.price;
                const li = document.createElement('li');
                li.className = "checkout-item-summary-line";
                li.innerHTML = `<span>${item.name}</span><span>$${item.price.toFixed(2)}</span>`;
                summaryList.appendChild(li);
            });
            totalVal.textContent = `$${sum.toFixed(2)}`;

            checkoutModal.classList.add('active');
        });
    }
    if (checkoutClose) checkoutClose.addEventListener('click', () => checkoutModal.classList.remove('active'));
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Simulate Payment
            showToast("Processing payment...", "info");
            setTimeout(() => {
                saveStored("zenfocus_cart", []);
                renderCart();
                checkoutModal.classList.remove('active');
                
                // Add points
                user.xp += 200;
                saveStored("zenfocus_user", user);
                if (xpBadge) xpBadge.textContent = `${user.xp} XP`;
                xpVals.forEach(v => v.textContent = `${user.xp} XP`);

                // Notifications
                const notifs = getStored("zenfocus_notifications", DEFAULT_STATE.notifications);
                notifs.unshift({ id: Date.now(), text: "ZenFocus Premium activated! Access to vaults unlocked.", time: "Just now", unread: true });
                saveStored("zenfocus_notifications", notifs);
                renderNotifications();

                showToast("Upgrade successful! +200 XP earned.", "success");
            }, 1500);
        });
    }
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

    if (!timerTime || !btnToggle || !btnReset) return;

    let settings = getStored("zenfocus_settings", DEFAULT_STATE.settings);
    let totalSeconds = settings.pomodoro * 60;
    let elapsedSeconds = 0;
    let timerInterval = null;
    let isRunning = false;
    let currentMode = 'pomodoro'; 
    let isAudioEnabled = settings.volume;

    const circleCircumference = 596.9;

    function getModeDurations() {
        const s = getStored("zenfocus_settings", DEFAULT_STATE.settings);
        return {
            pomodoro: s.pomodoro,
            short: s.short,
            long: s.long
        };
    }

    const modeLabels = {
        pomodoro: 'Time to Focus',
        short: 'Take a Short Break',
        long: 'Take a Long Break'
    };

    function updateDisplay() {
        const remainingSeconds = totalSeconds - elapsedSeconds;
        const mins = Math.floor(remainingSeconds / 60);
        const secs = remainingSeconds % 60;
        
        const displayTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        timerTime.textContent = displayTime;

        if (isRunning) {
            document.title = `(${displayTime}) ZenFocus — Focusing`;
        } else {
            document.title = `ZenFocus — Elevate Your Study & Focus Habits`;
        }

        const progressPercent = elapsedSeconds / totalSeconds;
        const offset = progressPercent * circleCircumference;
        if (timerProgress) {
            timerProgress.style.strokeDashoffset = offset;
        }

        if (remainingSeconds <= 0) {
            timerFinished();
        }
    }

    function toggleTimer() {
        if (isRunning) {
            clearInterval(timerInterval);
            isRunning = false;
            btnToggleText.textContent = 'Resume Focus';
            btnToggle.querySelector('.play-icon').classList.remove('hidden');
            btnToggle.querySelector('.pause-icon').classList.add('hidden');
            timerState.textContent = 'Focus Paused';
        } else {
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
        const durations = getModeDurations();
        totalSeconds = durations[mode] * 60;
        
        if (timerProgress) {
            if (mode === 'pomodoro') {
                timerProgress.style.stroke = 'var(--color-primary)';
            } else if (mode === 'short') {
                timerProgress.style.stroke = 'var(--color-accent)';
            } else {
                timerProgress.style.stroke = 'var(--color-secondary)';
            }
        }

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

        showToast(`${currentMode === 'pomodoro' ? 'Focus session' : 'Break'} finished!`, "success");

        if (currentMode === 'pomodoro') {
            // Log analytics
            const activeDur = getModeDurations().pomodoro;
            const analytics = getStored("zenfocus_analytics", DEFAULT_STATE.analytics);
            
            // Map Sat to Saturday, etc.
            const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            const currentDay = weekday[new Date().getDay()];
            
            analytics[currentDay] = (analytics[currentDay] || 0) + (activeDur / 60);
            saveStored("zenfocus_analytics", analytics);

            // Update user XP
            const user = getStored("zenfocus_user", DEFAULT_STATE.user);
            user.xp += 50;
            saveStored("zenfocus_user", user);

            // Update streak
            let streak = parseInt(localStorage.getItem("zenfocus_streak") || "12");
            streak += 1;
            saveStored("zenfocus_streak", streak);

            showToast("+50 XP Earned! Focus Streak incremented to " + streak, "success");
            
            // Update UI widgets
            updateAnalyticsUI();

            changeMode('short');
        } else {
            changeMode('pomodoro');
        }
    }

    // Global settings reload callback
    window.timerReloadSettings = function() {
        settings = getStored("zenfocus_settings", DEFAULT_STATE.settings);
        isAudioEnabled = settings.volume;
        changeMode(currentMode);
    };

    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            isAudioEnabled = !isAudioEnabled;
            audioToggle.querySelector('.vol-on-icon').classList.toggle('hidden');
            audioToggle.querySelector('.vol-off-icon').classList.toggle('hidden');
        });
    }

    btnToggle.addEventListener('click', toggleTimer);
    btnReset.addEventListener('click', resetTimer);

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            changeMode(button.dataset.mode);
        });
    });

    changeMode('pomodoro');
}

/* ==========================================================================
   3. Deadline Countdown Logic
   ========================================================================== */
function initDeadlineCountdown() {
    const dlHours = document.getElementById('dl-hours');
    const dlMins = document.getElementById('dl-mins');
    const dlSecs = document.getElementById('dl-secs');
    const submitBtn = document.querySelector('.deadline-action-btn');

    if (!dlHours || !dlMins || !dlSecs) return;

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

    if (submitBtn) {
        submitBtn.addEventListener('click', () => {
            showToast("Submitting SVNIT ML Hackathon project...", "info");
            setTimeout(() => {
                showToast("Project uploaded successfully!", "success");
            }, 1000);
        });
    }
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

    if (!tasksList) return;

    function renderTasks() {
        const list = getStored("zenfocus_tasks", DEFAULT_STATE.tasks);
        tasksList.innerHTML = "";

        list.forEach(task => {
            const newLi = document.createElement('li');
            newLi.className = `task-item ${task.completed ? 'completed' : ''}`;
            newLi.innerHTML = `
                <label class="task-checkbox-wrapper">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} class="task-checkbox" data-id="${task.id}">
                    <span class="task-custom-checkbox"><i data-lucide="check" class="check-icon"></i></span>
                    <span class="task-text">${escapeHtml(task.text)}</span>
                </label>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span class="task-tag tag-${task.tag}">${task.tag.charAt(0).toUpperCase() + task.tag.slice(1)}</span>
                    <button class="task-delete-btn" data-id="${task.id}" style="background:none; border:none; color:var(--color-text-muted); cursor:pointer;"><i data-lucide="trash-2" style="width:14px; height:14px;"></i></button>
                </div>
            `;
            tasksList.appendChild(newLi);
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        // Attach listeners
        tasksList.querySelectorAll('.task-checkbox').forEach(box => {
            box.addEventListener('change', () => {
                const id = parseInt(box.getAttribute('data-id'));
                const listData = getStored("zenfocus_tasks", DEFAULT_STATE.tasks);
                const task = listData.find(t => t.id === id);
                if (task) {
                    task.completed = box.checked;
                    saveStored("zenfocus_tasks", listData);
                    box.closest('.task-item').classList.toggle('completed', box.checked);
                    
                    // Award XP on complete
                    if (box.checked) {
                        const user = getStored("zenfocus_user", DEFAULT_STATE.user);
                        user.xp += 10;
                        saveStored("zenfocus_user", user);
                        showToast("Task completed! +10 XP earned.", "success");
                    }
                    updateTasksBadge();
                }
            });
        });

        tasksList.querySelectorAll('.task-delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.getAttribute('data-id'));
                let listData = getStored("zenfocus_tasks", DEFAULT_STATE.tasks);
                listData = listData.filter(t => t.id !== id);
                saveStored("zenfocus_tasks", listData);
                renderTasks();
                updateTasksBadge();
                showToast("Task deleted.", "info");
            });
        });

        updateTasksBadge();
    }

    function updateTasksBadge() {
        const listData = getStored("zenfocus_tasks", DEFAULT_STATE.tasks);
        const activeCount = listData.filter(t => !t.completed).length;
        const badges = document.querySelectorAll('#tasks-dropdown-link .badge');
        badges.forEach(b => {
            b.textContent = activeCount;
            b.style.display = activeCount === 0 ? "none" : "inline-block";
        });
    }

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => {
            taskInputWrapper.classList.toggle('hidden');
            if (!taskInputWrapper.classList.contains('hidden')) {
                taskInput.focus();
            }
        });
    }

    function submitTask() {
        const text = taskInput.value.trim();
        if (text === '') return;

        const tags = ['high', 'medium', 'low'];
        const randomTag = tags[Math.floor(Math.random() * tags.length)];

        const listData = getStored("zenfocus_tasks", DEFAULT_STATE.tasks);
        const newTask = {
            id: Date.now(),
            text: text,
            completed: false,
            tag: randomTag
        };
        listData.push(newTask);
        saveStored("zenfocus_tasks", listData);

        taskInput.value = '';
        taskInputWrapper.classList.add('hidden');
        
        renderTasks();
        showToast("New task added.", "success");
    }

    if (taskSubmitBtn) taskSubmitBtn.addEventListener('click', submitTask);
    if (taskInput) {
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitTask();
            }
        });
    }

    renderTasks();
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
   5. Interactive SVG Weekly Chart & Goal UI
   ========================================================================== */
function initWeeklyChart() {
    updateAnalyticsUI();

    const bars = document.querySelectorAll('.chart-bar');
    if (bars.length === 0) return;

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday (Today)', 'Sunday'];

    bars.forEach((bar, idx) => {
        bar.addEventListener('mouseenter', (e) => {
            const analytics = getStored("zenfocus_analytics", DEFAULT_STATE.analytics);
            const keys = Object.keys(analytics);
            const val = analytics[keys[idx]] || 0;

            const card = bar.closest('.stat-card');
            const detailsDesc = card.querySelector('.stat-desc');
            const statNum = card.querySelector('.stat-num');
            
            if (statNum) {
                statNum.innerHTML = `${val.toFixed(1)} <span class="stat-unit">hrs</span>`;
            }
            if (detailsDesc) {
                detailsDesc.textContent = `Focused on ${days[idx]}`;
                detailsDesc.style.color = 'var(--color-accent)';
            }
        });

        bar.addEventListener('mouseleave', (e) => {
            updateAnalyticsUI();
        });
    });
}

function updateAnalyticsUI() {
    const analytics = getStored("zenfocus_analytics", DEFAULT_STATE.analytics);
    const totalHours = Object.values(analytics).reduce((a, b) => a + b, 0);
    
    const totalLabel = document.querySelector('.stat-card:nth-of-type(2) .stat-num');
    const analyticsDesc = document.querySelector('.stat-card:nth-of-type(2) .stat-desc');
    if (totalLabel) {
        totalLabel.innerHTML = `${totalHours.toFixed(1)} <span class="stat-unit">hrs total</span>`;
    }
    if (analyticsDesc) {
        analyticsDesc.textContent = 'Up +14% compared to last week';
        analyticsDesc.style.color = '';
    }

    // Today's Goal Goal progress
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currentDay = weekday[new Date().getDay()];
    const todayHrs = analytics[currentDay] || 0;
    
    const settings = getStored("zenfocus_settings", DEFAULT_STATE.settings);
    const dailyGoal = settings.goal;

    const progressValue = document.querySelector('.progress-value');
    const radialBar = document.querySelector('.progress-radial-bar');
    const radialStatsText = document.querySelector('.stat-card:nth-of-type(1) .stat-num');
    const radialDesc = document.querySelector('.stat-card:nth-of-type(1) .stat-desc');

    const percent = Math.min(100, Math.round((todayHrs / dailyGoal) * 100));
    if (progressValue) progressValue.textContent = `${percent}%`;
    
    if (radialBar) {
        const offset = 251.2 - (percent / 100) * 251.2;
        radialBar.style.strokeDashoffset = offset;
    }

    if (radialStatsText) {
        radialStatsText.innerHTML = `${todayHrs.toFixed(1)} <span class="stat-unit">/ ${dailyGoal} hrs</span>`;
    }

    if (radialDesc) {
        const remaining = Math.max(0, dailyGoal - todayHrs);
        radialDesc.textContent = remaining > 0 ? `${remaining.toFixed(1)} hours remaining to hit goal` : "Daily focus target achieved!";
    }

    // Streaks milestones
    const streak = parseInt(localStorage.getItem("zenfocus_streak") || "12");
    const streakNum = document.querySelector('.streak-number');
    const streakDesc = document.querySelector('.streak-body .stat-desc');
    
    if (streakNum) streakNum.textContent = streak;
    if (streakDesc) {
        const toMilestone = Math.max(0, 15 - streak);
        streakDesc.textContent = toMilestone > 0 ? `${toMilestone} days until 15-day streak milestone!` : "15-day milestone reached! Keep going!";
    }

    // Redraw height of SVG Weekly Chart bars based on stored values
    const bars = document.querySelectorAll('.chart-bar');
    const daysKeys = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    bars.forEach((bar, idx) => {
        const val = analytics[daysKeys[idx]] || 0;
        const maxExpected = 10; // 10 hours max scale
        const height = Math.max(5, Math.min(75, (val / maxExpected) * 75));
        const y = 80 - height;
        
        bar.setAttribute('y', y);
        bar.setAttribute('height', height);
    });
}

/* ==========================================================================
   6. Navigation Link Triggers & Scroll behavior
   ========================================================================== */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Handle initial hash routing
    if (window.location.hash) {
        const hash = window.location.hash.slice(1);
        setTimeout(() => {
            scrollToSection(hash);
        }, 300);
    }
}

// Global Scroll helper
window.scrollToSection = function(id) {
    const target = document.getElementById(id);
    if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        
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

/* ==========================================================================
   Special Pages Interactive Modules
   ========================================================================== */

// Community Page Toggles
function initCommunityPage() {
    const viewAllBtn = document.getElementById('view-all-btn');
    if (!viewAllBtn) return;

    viewAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const hiddenItems = document.querySelectorAll('.room-hidden-item');
        
        if (hiddenItems.length === 0) return;
        
        const isHidden = hiddenItems[0].style.display !== 'flex';
        
        hiddenItems.forEach(item => {
            item.style.display = isHidden ? 'flex' : 'none';
        });

        viewAllBtn.textContent = isHidden ? "View Less" : "View All";
        showToast(isHidden ? "All focus rooms visible." : "Hidden focus rooms collapsed.", "info");
    });
}

// Resources Interactive AI Chat
function initResourcesPage() {
    const assistantTrigger = document.getElementById('ai-assistant-trigger');
    const aiModal = document.getElementById('ai-assistant-modal');
    const aiClose = document.getElementById('ai-assistant-close-btn');
    const chatInput = document.getElementById('ai-chat-input');
    const chatSendBtn = document.getElementById('ai-chat-send-btn');
    const chatMessages = document.getElementById('ai-chat-messages');

    if (!assistantTrigger || !aiModal) return;

    assistantTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        aiModal.classList.add('active');
    });

    if (aiClose) aiClose.addEventListener('click', () => aiModal.classList.remove('active'));

    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `ai-message ${sender}`;
        msgDiv.innerHTML = `<div class="message-content">${text}</div>`;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function generateAIResponse(userText) {
        // Typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-message assistant typing';
        typingDiv.innerHTML = `<div class="message-content">Thinking...</div>`;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        setTimeout(() => {
            typingDiv.remove();
            let reply = "I'm on it! ZenStudy AI can search lecture folders and generate custom study metrics. What other SVNIT subject are you working on?";
            
            const q = userText.toLowerCase();
            if (q.includes("machine learning") || q.includes("ml")) {
                reply = "Machine learning covers regression, SVMs, and neural networks at SVNIT. For exam revision, I suggest trying out PyTorch tutorials or checking Lecture 12 slides in our Vault!";
            } else if (q.includes("atomic habits") || q.includes("habit")) {
                reply = "Chapter 4 of Atomic Habits focuses on making your focus cues obvious. Set a standard SVNIT study trigger, like opening ZenFocus right after your morning coffee!";
            } else if (q.includes("exam") || q.includes("prep")) {
                reply = "Preparing for Mid-sem? Set ZenFocus timer to 45 mins work and 10 mins break. Reviewing the previous semesters' papers under SVNIT Vault will boost your preparedness by 30%!";
            } else if (q.includes("streak") || q.includes("goal")) {
                reply = "Consistent focus streak triggers reward points. Complete your 8-hour target today and you will unlock the 'Focus Champion' badge on your profile!";
            }

            addMessage(reply, 'assistant');
        }, 1200);
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (text === "") return;

        addMessage(text, 'user');
        chatInput.value = "";
        generateAIResponse(text);
    }

    if (chatSendBtn) chatSendBtn.addEventListener('click', handleSend);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }
}

// Rooms Page Immersive Simulator
function initRoomsPage() {
    const lobby = document.getElementById('rooms-lobby-container');
    const roomContainer = document.getElementById('active-room-container');
    const joinButtons = document.querySelectorAll('.join-room-btn');
    const leaveBtn = document.getElementById('leave-room-btn');
    const chatInput = document.getElementById('room-chat-input');
    const chatSend = document.getElementById('room-chat-send');
    const chatMessages = document.getElementById('room-chat-messages');
    const videoGrid = document.getElementById('video-grid');

    if (!roomContainer || !lobby) return;

    const mockParticipants = [
        { name: "Sneha Mehta (Focusing)", avatar: "assets/avatar.png", active: false },
        { name: "Dev K. (Speaking)", avatar: "assets/avatar.png", active: true, speaking: true },
        { name: "Prof. Patel (Sharing Screen)", avatar: "assets/avatar.png", active: true, screen: true },
        { name: "Priya Shah (Focusing)", avatar: "assets/avatar.png", active: false },
        { name: "Raj Nair (Focusing)", avatar: "assets/avatar.png", active: false }
    ];

    const mockMessages = [
        { user: "Dev K.", text: "Hello! Let's crush this focus sprint today." },
        { user: "Sneha M.", text: "Agreed. Working on my Computer Graphics lab journal." },
        { user: "Raj N.", text: "Has anyone completed the ML coding challenge yet?" },
        { user: "Priya S.", text: "Yes, final review of the PyTorch training model is ongoing." }
    ];

    let simulationInterval = null;

    function renderParticipants() {
        if (!videoGrid) return;
        videoGrid.innerHTML = "";

        // Add self
        const selfCard = document.createElement('div');
        selfCard.className = "video-feed-card active-user";
        selfCard.innerHTML = `
            <img src="assets/avatar.png" class="video-avatar-large" alt="You">
            <span class="participant-name">Alex Rivera (You)</span>
            <div class="mic-status"><i data-lucide="mic"></i></div>
        `;
        videoGrid.appendChild(selfCard);

        // Add others
        mockParticipants.forEach(p => {
            const card = document.createElement('div');
            card.className = `video-feed-card ${p.speaking ? 'speaking' : ''}`;
            
            if (p.screen) {
                card.innerHTML = `
                    <div style="background:#090d1a; width:100%; height:100%; display:flex; align-items:center; justify-content:center;" class="video-screen-sharing">
                        <i data-lucide="monitor" style="width:40px; height:40px; color:var(--color-primary);"></i>
                    </div>
                    <span class="participant-name">${p.name}</span>
                `;
            } else {
                card.innerHTML = `
                    <img src="${p.avatar}" class="video-avatar-large" alt="${p.name}">
                    <span class="participant-name">${p.name}</span>
                    <div class="mic-status ${!p.speaking ? 'muted' : ''}">
                        <i data-lucide="${p.speaking ? 'mic' : 'mic-off'}"></i>
                    </div>
                `;
            }
            videoGrid.appendChild(card);
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function startSimulation() {
        if (!chatMessages) return;
        chatMessages.innerHTML = "";
        
        mockMessages.forEach(msg => {
            appendChatMessage(msg.user, msg.text);
        });

        const chatUsers = ["Sneha M.", "Dev K.", "Priya S.", "Raj N."];
        const chatTexts = [
            "Pomodoro mode engaged. 25 mins deep work!",
            "I'm keeping my microphone muted for silent library style.",
            "Atomic Habits Chapter 4 says: make it obvious. So I opened this study hall!",
            "Good progress everyone. Let's study for another hour.",
            "Can someone clarify Viva questions on SVM kernels?",
            "Yes, kernel tricks map data to higher dimensional spaces to make it linear."
        ];

        let msgIdx = 0;
        simulationInterval = setInterval(() => {
            const user = chatUsers[Math.floor(Math.random() * chatUsers.length)];
            const text = chatTexts[msgIdx % chatTexts.length];
            appendChatMessage(user, text);
            msgIdx++;
        }, 7000);
    }

    function appendChatMessage(user, text) {
        const isSelf = user === "Alex Rivera (You)";
        const msgDiv = document.createElement('div');
        msgDiv.className = `room-chat-message ${isSelf ? 'self' : ''}`;
        msgDiv.innerHTML = `
            <span class="msg-user">${user}</span>
            <span class="msg-text">${escapeHtml(text)}</span>
        `;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    joinButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            lobby.classList.add('hidden');
            roomContainer.classList.remove('hidden');
            
            const roomTitle = btn.closest('.room-item').querySelector('.room-title').textContent;
            document.getElementById('active-room-title').textContent = roomTitle;

            renderParticipants();
            startSimulation();
            showToast("Successfully joined " + roomTitle + "!", "success");
        });
    });

    if (leaveBtn) {
        leaveBtn.addEventListener('click', () => {
            clearInterval(simulationInterval);
            roomContainer.classList.add('hidden');
            lobby.classList.remove('hidden');
            showToast("Left study hall room.", "info");
        });
    }

    function sendRoomMessage() {
        const text = chatInput.value.trim();
        if (text === "") return;

        appendChatMessage("Alex Rivera (You)", text);
        chatInput.value = "";
    }

    if (chatSend) chatSend.addEventListener('click', sendRoomMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendRoomMessage();
        });
    }
}
