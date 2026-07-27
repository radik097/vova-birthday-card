let canvas = null;
let ctx = null;
let sparkles = [];
let animationFrame = null;
let mouseX = 0;
let mouseY = 0;
let isActive = false;

const colors = ["#f5bf57", "#ffe3a1", "#ffffff", "#e94d3c", "#ffd700"];

export function initSparkles(canvasEl) {
    canvas = canvasEl;
    ctx = canvas.getContext("2d");
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isActive) {
            isActive = true;
            renderSparkles();
        }
        addSparkle();
    });

    document.addEventListener("touchmove", (e) => {
        const touch = e.touches[0];
        if (touch) {
            mouseX = touch.clientX;
            mouseY = touch.clientY;
            if (!isActive) {
                isActive = true;
                renderSparkles();
            }
            addSparkle();
        }
    });

    document.addEventListener("mouseleave", () => {
        isActive = false;
        cancelAnimationFrame(animationFrame);
    });
}

function resizeCanvas() {
    if (!canvas) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    if (ctx) ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function addSparkle() {
    sparkles.push({
        x: mouseX + (Math.random() - 0.5) * 20,
        y: mouseY + (Math.random() - 0.5) * 20,
        size: 2 + Math.random() * 5,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2 - 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        decay: 0.015 + Math.random() * 0.025,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1,
    });

    if (sparkles.length > 200) {
        sparkles.splice(0, sparkles.length - 200);
    }
}

function renderSparkles() {
    if (!ctx || !isActive) return;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (let i = sparkles.length - 1; i >= 0; i--) {
        const s = sparkles[i];
        s.x += s.speedX;
        s.y += s.speedY;
        s.rotation += s.rotationSpeed;
        s.life -= s.decay;

        if (s.life <= 0) {
            sparkles.splice(i, 1);
            continue;
        }

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rotation);
        ctx.globalAlpha = s.life;

        // Draw sparkle as a star shape
        const size = s.size * s.life;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 6;

        ctx.beginPath();
        for (let j = 0; j < 4; j++) {
            const angle = (j * Math.PI) / 2;
            const x1 = Math.cos(angle) * size;
            const y1 = Math.sin(angle) * size;
            const x2 = Math.cos(angle + Math.PI / 4) * size * 0.35;
            const y2 = Math.sin(angle + Math.PI / 4) * size * 0.35;
            if (j === 0) {
                ctx.moveTo(x1, y1);
            } else {
                ctx.lineTo(x1, y1);
            }
            ctx.lineTo(x2, y2);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    animationFrame = requestAnimationFrame(renderSparkles);
}

export function stopSparkles() {
    isActive = false;
    cancelAnimationFrame(animationFrame);
    if (ctx) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    sparkles = [];
}

