const balloonColors = [
    "#e94d3c",
    "#f5bf57",
    "#0f7b5d",
    "#4a90d9",
    "#ff6b9d",
    "#a855f7",
    "#22c55e",
    "#f97316",
];

let container = null;
let intervalId = null;
let stopTimerId = null;
let balloonCount = 0;
let creationTimers = new Set();

export function initBalloons(containerEl) {
    container = containerEl;
}

export function startBalloons() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!container) return;

    stopBalloons();

    const isMobile = window.innerWidth < 760;
    const maxBalloons = isMobile ? 8 : 16;
    const spawnRate = isMobile ? 2000 : 1400;
    const initialCount = isMobile ? 3 : 6;

    for (let index = 0; index < initialCount; index++) {
        const timerId = setTimeout(() => {
            creationTimers.delete(timerId);
            createBalloon();
        }, index * 300);

        creationTimers.add(timerId);
    }

    intervalId = setInterval(() => {
        if (balloonCount < maxBalloons) {
            createBalloon();
        }
    }, spawnRate);

    stopTimerId = setTimeout(stopBalloons, 18000);
}

function createBalloon() {
    if (!container) return;

    const isMobile = window.innerWidth < 760;
    const maxBalloons = isMobile ? 8 : 16;

    if (balloonCount >= maxBalloons) return;

    const balloon = document.createElement("div");
    balloon.className = "balloon";
    balloonCount++;

    const color =
        balloonColors[Math.floor(Math.random() * balloonColors.length)];
    const startX = 10 + Math.random() * 80;
    const duration = 6 + Math.random() * 6;
    const size = 28 + Math.random() * 22;
    const delay = Math.random() * 2;

    balloon.style.cssText = `
        left: ${startX}%;
        bottom: -60px;
        width: ${size}px;
        height: ${size * 1.3}px;
        background: radial-gradient(circle at 30% 30%, ${color}dd, ${color});
        border-radius: 50%;
        position: absolute;
        z-index: 0;
        pointer-events: none;
        box-shadow:
            inset -4px -4px 8px rgba(0, 0, 0, 0.15),
            inset 4px 4px 8px rgba(255, 255, 255, 0.25);
        animation:
            balloonFloat ${duration}s ease-in-out ${delay}s forwards,
            balloonSway ${duration * 0.7}s ease-in-out ${delay}s infinite;
    `;

    const string = document.createElement("div");
    string.style.cssText = `
        position: absolute;
        top: 100%;
        left: 50%;
        width: 1px;
        height: 50px;
        background: linear-gradient(
            transparent,
            rgba(255, 255, 255, 0.3)
        );
        transform-origin: top center;
    `;

    balloon.appendChild(string);
    container.appendChild(balloon);

    setTimeout(() => {
        if (balloon.isConnected) {
            balloon.remove();
        }

        balloonCount = Math.max(0, balloonCount - 1);
    }, (duration + delay) * 1000 + 500);
}

export function stopBalloons() {
    clearInterval(intervalId);
    clearTimeout(stopTimerId);

    intervalId = null;
    stopTimerId = null;

    creationTimers.forEach((timerId) => clearTimeout(timerId));
    creationTimers.clear();
}

export function cleanupBalloons() {
    stopBalloons();

    if (container) {
        container.replaceChildren();
    }

    balloonCount = 0;
}
