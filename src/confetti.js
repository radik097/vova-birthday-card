const colors = ["#f5bf57", "#ffe3a1", "#e94d3c", "#0f7b5d", "#ffffff"];

let pieces = [];
let animationFrame = null;
let canvas = null;
let ctx = null;
let confettiTimer = null;

export function initConfetti(canvasEl) {
    if (!(canvasEl instanceof HTMLCanvasElement)) return;

    canvas = canvasEl;
    ctx = canvas.getContext("2d");

    if (!ctx) return;

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
}

function resizeCanvas() {
    if (!canvas || !ctx) return;

    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createRainPiece(x, y) {
    return {
        type: "rain",
        x: x ?? Math.random() * window.innerWidth,
        y: y ?? Math.random() * window.innerHeight - window.innerHeight,
        size: 4 + Math.random() * 10,
        speed: 1.2 + Math.random() * 4.5,
        drift: -1.5 + Math.random() * 3,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: -0.15 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.02 + Math.random() * 0.04,
    };
}

function createBurstPiece(x, y) {
    const angle = Math.random() * Math.PI * 2;
    const force = 2 + Math.random() * 7;

    return {
        type: "burst",
        x,
        y,
        size: 3 + Math.random() * 8,
        velocityX: Math.cos(angle) * force,
        velocityY: Math.sin(angle) * force - 2,
        spin: Math.random() * Math.PI * 2,
        spinSpeed: -0.2 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        gravity: 0.11 + Math.random() * 0.05,
        life: 1,
        decay: 0.008 + Math.random() * 0.008,
    };
}

function ensureAnimation() {
    if (animationFrame === null) {
        animationFrame = requestAnimationFrame(renderConfetti);
    }
}

function renderConfetti() {
    if (!ctx) {
        animationFrame = null;
        return;
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let index = pieces.length - 1; index >= 0; index--) {
        const piece = pieces[index];

        if (piece.type === "burst") {
            piece.velocityY += piece.gravity;
            piece.x += piece.velocityX;
            piece.y += piece.velocityY;
            piece.spin += piece.spinSpeed;
            piece.life -= piece.decay;

            if (
                piece.life <= 0 ||
                piece.y > window.innerHeight + 60 ||
                piece.x < -60 ||
                piece.x > window.innerWidth + 60
            ) {
                pieces.splice(index, 1);
                continue;
            }
        } else {
            piece.speed += piece.gravity;
            piece.y += piece.speed;
            piece.x += piece.drift + Math.sin(piece.spin) * 0.3;
            piece.spin += piece.spinSpeed;

            if (piece.y > window.innerHeight + 30) {
                piece.y = -20;
                piece.x = Math.random() * window.innerWidth;
                piece.speed = 1.2 + Math.random() * 4.5;
            }
        }

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate(piece.spin);
        ctx.fillStyle = piece.color;
        ctx.globalAlpha = piece.life ?? 0.9;
        ctx.fillRect(
            -piece.size / 2,
            -piece.size / 3,
            piece.size,
            piece.size * 0.62
        );
        ctx.restore();
    }

    if (pieces.length > 0) {
        animationFrame = requestAnimationFrame(renderConfetti);
    } else {
        animationFrame = null;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}

export function startConfetti(duration = 7200, x, y) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    pieces = pieces.filter((piece) => piece.type === "burst");

    const count = window.innerWidth < 760 ? 90 : 150;
    for (let index = 0; index < count; index++) {
        pieces.push(createRainPiece(x, y));
    }

    ensureAnimation();

    clearTimeout(confettiTimer);

    if (duration > 0) {
        confettiTimer = setTimeout(() => {
            pieces = pieces.filter((piece) => piece.type !== "rain");

            if (pieces.length === 0 && ctx) {
                cancelAnimationFrame(animationFrame);
                animationFrame = null;
                ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            }
        }, duration);
    }
}

export function burstConfetti(x, y, count = 60) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const originX = x ?? window.innerWidth / 2;
    const originY = y ?? window.innerHeight / 2;

    for (let index = 0; index < count; index++) {
        pieces.push(createBurstPiece(originX, originY));
    }

    ensureAnimation();
}

export function stopConfetti() {
    clearTimeout(confettiTimer);
    cancelAnimationFrame(animationFrame);

    animationFrame = null;
    pieces = [];

    if (ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}
