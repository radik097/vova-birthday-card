import config from "./config.js";
import { initConfetti, startConfetti, burstConfetti, stopConfetti } from "./confetti.js";
import { initSparkles, stopSparkles } from "./sparkles.js";
import { initBalloons, startBalloons, cleanupBalloons } from "./balloons.js";
import { toggleMusic, isMusicPlaying } from "./music.js";

// --- DOM references ---
const card = document.getElementById("card");
const openButton = document.getElementById("openButton");
const replayButton = document.getElementById("replayButton");
const giftBox = document.getElementById("giftBox");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = musicToggle?.querySelector(".music-icon");
const wishCounter = document.getElementById("wishCounter");

// --- State ---
let isOpen = false;
let wishesRevealed = 0;

// --- Text helpers ---
function setText(selector, value) {
    const node = document.querySelector(selector);
    if (node && value) node.textContent = value;
}

function applyConfig() {
    document.title = config.headline || document.title;
    setText('[data-card="closedTitle"]', config.closedTitle || config.name);
    setText('[data-card="closedSubtitle"]', config.closedSubtitle);
    setText('[data-card="openButton"]', config.openButton);
    setText('[data-card="headline"]', config.headline);
    setText('[data-card="lead"]', config.lead);
    setText('[data-card="signature"]', config.signature);
    if (replayButton && config.replayButton) replayButton.textContent = config.replayButton;

    const wishes = document.querySelector('[data-card="wishes"]');
    if (wishes) {
        wishes.innerHTML = "";
        (config.wishes || []).forEach((wish, index) => {
            const item = document.createElement("li");
            item.textContent = wish;
            item.style.setProperty("--wish-index", index);
            wishes.appendChild(item);
        });
    }

    openButton.setAttribute(
        "aria-label",
        `${config.openButton || "Открыть открытку"}: ${config.headline || ""}`.trim()
    );

    updateWishCounter();
}

function updateWishCounter() {
    const total = config.wishes?.length || 0;
    if (wishCounter) {
        wishCounter.textContent = `${wishesRevealed}/${total}`;
    }
}

// --- Card Logic ---
function openCard() {
    if (isOpen) return;
    isOpen = true;
    card.classList.add("is-open");
    startConfetti(7200);

    // Reveal wishes with burst
    const wishItems = document.querySelectorAll(".wishes li");
    wishesRevealed = 0;
    wishItems.forEach((item, index) => {
        const revealDelay = 520 + index * 170;
        setTimeout(() => {
            item.classList.add("revealed");
            wishesRevealed = index + 1;
            updateWishCounter();
            // Burst confetti on each wish reveal
            if (isOpen) {
                const rect = item.getBoundingClientRect();
                burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 20);
            }
        }, revealDelay);
    });

    // Start balloons after a delay
    setTimeout(startBalloons, 1200);
}

function replayCard() {
    isOpen = false;
    wishesRevealed = 0;
    updateWishCounter();
    card.classList.remove("is-open");
    cleanupBalloons();
    stopConfetti();

    document.querySelectorAll(".wishes li").forEach((item) => {
        item.classList.remove("revealed");
    });

    setTimeout(openCard, 260);
}

// --- Gift Box ---
function handleGiftClick(e) {
    const rect = giftBox.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    burstConfetti(cx, cy, 100);
    giftBox.classList.add("gift-opened");

    // Remove gift after animation
    setTimeout(() => {
        giftBox.style.display = "none";
    }, 1200);

    // Also open card if not already
    if (!isOpen) {
        openCard();
    }
}

// --- Music ---
function handleMusicToggle() {
    const nowPlaying = toggleMusic();
    if (musicIcon) {
        musicIcon.textContent = nowPlaying ? "🔊" : "🔇";
    }
    musicToggle.setAttribute(
        "aria-label",
        nowPlaying ? "Выключить музыку" : "Включить музыку"
    );
}

// --- Click burst (anywhere after card is open) ---
function handleSceneClick(e) {
    if (!isOpen) return;
    // Don't trigger on buttons
    if (e.target.closest("button")) return;
    if (e.target.closest(".card__cover")) return;
    if (e.target.closest(".gift-box")) return;
    if (e.target.closest(".music-toggle")) return;

    burstConfetti(e.clientX, e.clientY, 40);
}

// --- Keyboard shortcuts ---
function handleKeydown(e) {
    const key = e.key.toLowerCase();
    if (key === "o" && !isOpen) {
        openCard();
    } else if (key === "r") {
        replayCard();
    } else if (key === "c") {
        burstConfetti(window.innerWidth / 2, window.innerHeight / 2, 60);
    } else if (key === "m") {
        handleMusicToggle();
    } else if (key === " ") {
        e.preventDefault();
        openCard();
    }
}

// --- Init ---
function init() {
    applyConfig();

    // Init canvases
    initConfetti(document.querySelector(".confetti"));
    initSparkles(document.querySelector(".sparkle-canvas"));
    initBalloons(document.getElementById("balloonsContainer"));

    // Events
    openButton.addEventListener("click", openCard);
    replayButton.addEventListener("click", replayCard);
    giftBox.addEventListener("click", handleGiftClick);
    musicToggle.addEventListener("click", handleMusicToggle);

    document.addEventListener("click", handleSceneClick);
    document.addEventListener("keydown", handleKeydown);

    // Auto-open from query param
    if (new URLSearchParams(window.location.search).get("open") === "1") {
        setTimeout(openCard, 250);
    }
}

document.addEventListener("DOMContentLoaded", init);
