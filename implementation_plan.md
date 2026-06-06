# Implementation Plan - Student Productivity and Focus Homepage (ZenFocus)

This plan outlines the architecture, design token system, assets, and step-by-step layout for creating a visually stunning, premium, dark-themed student productivity homepage.

## User Review Required

> [!IMPORTANT]
> The website will be built as a single-page responsive application with interactive HTML, CSS, and JS components. It features:
> - Calming dark theme focus-app color palette: Deep navy blue (`#0B0F19`), rich indigo (`#1E1B4B` to `#312E81`), purple accents (`#8B5CF6`), cyan highlights (`#06B6D4`), and white/slate text.
> - Premium glassmorphism effects (`backdrop-filter: blur(16px)` with semi-transparent borders).
> - Fully functional interactive elements: Pomodoro Timer (Start/Pause/Reset, mode switcher), Interactive Study Streak and Progress Chart (rendered via SVG), Dropdown Profile menu, Tasks quick-list, and a Cart indicator.

Please review the planned UI layout and color theme. Once approved, I will begin generating the code files.

## Proposed Layout & Components

We will structure the project with three core files inside the workspace directory `d:\ASUS\Desktop\Manu\SVNIT CSE\Hackathons\HackerMars`:
1. `index.html` - Semantic structure.
2. `style.css` - Custom styling rules, glassmorphism UI, transitions, animations, and dark mode theme.
3. `app.js` - Logic for the interactive Pomodoro timer, profile dropdown menu, task checking, and chart animation.

### Assets Generation
We will use the image generation tool to create high-quality assets to give the app a premium, production-ready feel:
- `assets/logo.png` - A sleek, modern glowing abstract emblem representing focus/zen.
- `assets/avatar.png` - A circular, stylish profile avatar.
- `assets/hero-illustration.png` - A floating futuristic productivity 3D illustration (e.g. sandglass, neon shapes, abstract glowing book).

---

### [Component Name]

#### [NEW] [index.html](file:///d:/ASUS/Desktop/Manu/SVNIT%20CSE/Hackathons/HackerMars/index.html)
- **Header/Navbar**: Sticky, translucent frosted glass bar containing:
  - Left: App logo, app name (`ZenFocus`).
  - Right: Nav links (Dashboard, Focus, Community, Resources, Cart [with badge]), and circular Profile Avatar.
  - Dropdown Menu: Styled inside the profile wrapper, showing Tasks, Progress, and Log Out on hover with smooth transition.
- **Hero Section**:
  - Left/Center: Large quote card displaying "Small steps every day create extraordinary results" with premium typography (Outfit/Inter), glowing background gradients, and micro-hover tilts.
  - Floating decorative animated shapes (CSS-animated glowing SVGs and canvas particles for a starry/calm sky background).
- **Dashboard Section**:
  - Grid layout containing:
    - **Today's Goal Card**: Circular SVG progress bar (5.5 / 8 hrs = 68.75%).
    - **Completed Card**: Stats and a daily breakdown SVG bar chart.
    - **Current Streak Card**: Animated glowing fire/streak icon, "12 Days" with motivational subtext.
    - **Next Deadline Card**: Glowing countdown card for the "Machine Learning Competition Submission – Tomorrow 11:59 PM".
- **Focus Session Card**:
  - Interactive Pomodoro Timer widget:
    - Display timer state (25:00 default).
    - Buttons: Start/Pause, Reset, and Mode select (Pomodoro, Short Break, Long Break).
    - A visual circular progress indicator that shrinks/grows as the timer counts down.
- **Community Highlights Section**:
  - Cards showing active study rooms (e.g. "Space Library #2 - 42 online"), weekly top students leaderboard, and recent milestones.
- **Resources Section**:
  - 4 premium card grids: Notes, Practice Problems, AI Study Assistant, and Previous Year Papers, each with custom icons and hover transitions.

#### [NEW] [style.css](file:///d:/ASUS/Desktop/Manu/SVNIT%20CSE/Hackathons/HackerMars/style.css)
- CSS Variables for color system:
  - `--bg-base`: `#050811` (ultra dark slate)
  - `--bg-surface`: `rgba(13, 20, 38, 0.45)` (glassmorphism base)
  - `--bg-surface-hover`: `rgba(21, 31, 58, 0.6)`
  - `--border-color`: `rgba(255, 255, 255, 0.08)`
  - `--border-glow`: `rgba(139, 92, 246, 0.3)`
  - `--text-primary`: `#F8FAFC`
  - `--text-secondary`: `#94A3B8`
  - `--color-primary`: `#8B5CF6` (purple)
  - `--color-secondary`: `#6366F1` (indigo)
  - `--color-accent`: `#06B6D4` (cyan)
  - `--color-success`: `#10B981` (emerald)
- Beautiful fonts (Outfit & Inter) loaded from Google Fonts.
- Responsive flexbox/grid layout (mobile responsive, scales up to large screens).
- Transitions and custom scrollbar styles.

#### [NEW] [app.js](file:///d:/ASUS/Desktop/Manu/SVNIT%20CSE/Hackathons/HackerMars/app.js)
- **Profile Dropdown**: Hover-based triggers, keyboard accessibility, and state management.
- **Pomodoro Timer**: Functional JavaScript countdown logic with clean interval handling, state toggle (Start/Pause), and reset. Updates the document title with the remaining time for convenience.
- **Interactive SVG Chart**: Animate chart paths on page load.
- **Interactions**: Add subtle sound effects/visual pulses on milestones.

---

## Verification Plan

### Automated/Tool Verification
- Verify that index.html opens correctly in the browser without any errors.
- Test responsive layouts and all hover effects using browser tests.

### Manual Verification
- Start the Pomodoro timer, watch it count down, test pausing, resetting, and switching modes.
- Verify profile dropdown opens cleanly.
- Verify styling matches a premium dark-themed SaaS website.
