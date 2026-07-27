const balloonEmojis = ["🎈", "🎈", "🎈", "🎈"];
const balloonColors = [
    "#e94d3c", "#f5bf57", "#0f7b5d", "#4a90d9",
    "#ff6b9d", "#a855f7", "#22c55e", "#f97316",
];

let container = null;
let intervalId = null;
let balloonCount = 0;

export function initBalloons(containerEl) {
    container = containerEl;
}

export function startBalloons() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!container) return;

    const isMobile = window.innerWidth < 760;
    const maxBalloons = isMobile ? 8 : 16;
    const spawnRate = isMobile ? 2000 : 1400;

    // Spawn initial batch
    for (let i = 0; i < (isMobile ? 3 : 6); i++) {
        setTimeout(() => createBalloon(), i * 300);
    }

    intervalId = setInterval(() => {
        if (balloonCount >= maxBalloons) return;
        createBalloon();
    }, spawnRate);

    // Auto-stop after 18 seconds
    setTimeout(() => {
        stopBalloons();
    }, 18000);
}

function createBalloon() {
    if (!container) return;
    const isMobile = window.innerWidth < 760;
    const maxBalloons = isMobile ? 8 : 16;
    if (balloonCount >= maxBalloons) return;

    const balloon = document.createElement("div");
    balloon.className = "balloon";
    balloonCount++;

    const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
    const startX = 10 + Math.random() * 80;
    const swayAmount = 20 + Math.random() * 40;
    const duration = 6 + Math.random() * 6;
    const size = 28 + Math.random() * 22;

    balloon.style.cssText = `
    left: ${startX}%;
    bottom: -60px;
    width: ${size}px;
    height: ${size * 1.3}px;
    background: radial-gradient(circle at 30% 30%, ${color}dd, ${color});
    border-radius: 50% 50% 50% 50%;
    position: absolute;
    z-index: 0;
    pointer-events: none;
    box-shadow: inset -4px -4px 8px rgba(0,0,0,0.15),
                inset 4px 4px 8px rgba(255,255,255,0.25);
    animation: balloonFloat ${duration}s ease-in-out forwards,
               balloonSway ${duration * 0.7}s ease-in-out ${Math.random() * 2}s infinite;
  `;

    // Add string
    const string = document.createElement("div");
    string.style.cssText = `
    position: absolute;
    top: 100%;
    left: 50%;
    width: 1px;
    height: 50px;
    background: linear-gradient(transparent, rgba(255,255,255,0.3));
    transform-origin: top center;
  `;
    balloon.appendChild(string);

    // Random start delay
    balloon.style.animationDelay = `${Math.random() * 2}s`;

    container.appendChild(balloon);

    // Remove after animation
    setTimeout(() => {
        if (balloon.parentNode) {
            balloon.remove();
            balloonCount--;
        }
    }, duration * 1000 + 2000);
}

export function stopBalloons() {
    clearInterval(intervalId);
}

export function cleanupBalloons() {
    stopBalloons();
    if (container) {
        container.innerHTML = "";
        balloonCount = 0;
    }
}

