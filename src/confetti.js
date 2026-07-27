const colors = ["#f5bf57", "#ffe3a1", "#e94d3c", "#0f7b5d", "#ffffff"];
let pieces = [];
let animationFrame = null;
let canvas = null;
let ctx = null;

export function initConfetti(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
}

function resizeCanvas() {
    if (!canvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createConfetti(count, x, y) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    pieces = Array.from({ length: count }, () => ({
        x: x ?? Math.random() * width,
        y: y ?? Math.random() * height - height,
        size: 4 + Math.random() * 10,
        speed: 1.2 + Math.random() * 4.5,
        drift: -1.5 + Math.random() * 3,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: -0.15 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.02 + Math.random() * 0.04,
    }));
}

function renderConfetti() {
    if (!ctx) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    pieces.forEach((piece) => {
        piece.speed += piece.gravity;
        piece.y += piece.speed;
        piece.x += piece.drift + Math.sin(piece.spin) * 0.3;
        piece.spin += piece.spinSpeed;

        if (piece.y > window.innerHeight + 30) {
            piece.y = -20;
            piece.x = Math.random() * window.innerWidth;
        }

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.spin);
        ctx.fillStyle = piece.color;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(-piece.size / 2, -piece.size / 3, piece.size, piece.size * 0.62);
        ctx.restore();
    });

    animationFrame = requestAnimationFrame(renderConfetti);
}

export function startConfetti(duration = 7200, x, y) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(animationFrame);
    createConfetti(window.innerWidth < 760 ? 90 : 150, x, y);
    renderConfetti();

    if (duration > 0) {
        clearTimeout(window._confettiTimer);
        window._confettiTimer = setTimeout(() => {
            cancelAnimationFrame(animationFrame);
            if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            pieces = [];
        }, duration);
    }
}

export function burstConfetti(x, y, count = 60) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(animationFrame);

    const width = window.innerWidth;
    const height = window.innerHeight;
    pieces = Array.from({ length: count }, () => ({
        x: x ?? width / 2,
        y: y ?? height / 2,
        size: 3 + Math.random() * 8,
        speed: 1 + Math.random() * 6,
        drift: -3 + Math.random() * 6,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: -0.2 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.03 + Math.random() * 0.05,
        life: 1,
    }));

    renderConfetti();

    clearTimeout(window._burstTimer);
    window._burstTimer = setTimeout(() => {
        cancelAnimationFrame(animationFrame);
        if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        pieces = [];
    }, 5000);
}

export function stopConfetti() {
    cancelAnimationFrame(animationFrame);
    if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    pieces = [];
}

