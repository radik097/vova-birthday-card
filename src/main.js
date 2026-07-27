import config from "./config.js";
import {
    initConfetti,
    startConfetti,
    burstConfetti,
    stopConfetti,
} from "./confetti.js";
import { initSparkles } from "./sparkles.js";
import {
    initBalloons,
    startBalloons,
    cleanupBalloons,
} from "./balloons.js";
import { toggleMusic } from "./music.js";

const card = document.getElementById("card");
const openButton = document.getElementById("openButton");
const replayButton = document.getElementById("replayButton");
const giftBox = document.getElementById("giftBox");
const musicToggle = document.getElementById("musicToggle");
const musicIcon = musicToggle?.querySelector(".music-icon");
const wishCounter = document.getElementById("wishCounter");

let isOpen = false;
let wishesRevealed = 0;
let wishTimers = [];
let balloonStartTimer = null;
let replayTimer = null;

function setText(selector, value) {
    const node = document.querySelector(selector);

    if (node && typeof value === "string") {
        node.textContent = value;
    }
}

function clearCardTimers() {
    wishTimers.forEach((timerId) => clearTimeout(timerId));
    wishTimers = [];

    clearTimeout(balloonStartTimer);
    clearTimeout(replayTimer);

    balloonStartTimer = null;
    replayTimer = null;
}

function applyConfig() {
    document.title = config.headline || document.title;

    setText('[data-card="closedTitle"]', config.closedTitle || config.name);
    setText('[data-card="closedSubtitle"]', config.closedSubtitle);
    setText('[data-card="openButton"]', config.openButton);
    setText('[data-card="headline"]', config.headline);
    setText('[data-card="lead"]', config.lead);
    setText('[data-card="signature"]', config.signature);

    if (replayButton && config.replayButton) {
        replayButton.textContent = config.replayButton;
    }

    const wishes = document.querySelector('[data-card="wishes"]');

    if (wishes) {
        wishes.replaceChildren();

        for (const wish of config.wishes || []) {
            const item = document.createElement("li");
            item.textContent = wish;
            wishes.appendChild(item);
        }
    }

    openButton?.setAttribute(
        "aria-label",
        `${config.openButton || "Открыть открытку"}: ${
            config.headline || ""
        }`.trim()
    );

    updateWishCounter();
}

function updateWishCounter() {
    const total = config.wishes?.length || 0;

    if (wishCounter) {
        wishCounter.textContent = `${wishesRevealed}/${total}`;
    }
}

function openCard() {
    if (isOpen || !card) return;

    clearCardTimers();

    isOpen = true;
    card.classList.add("is-open");
    openButton?.setAttribute("aria-expanded", "true");

    startConfetti(7200);

    const wishItems = document.querySelectorAll(".wishes li");
    wishesRevealed = 0;
    updateWishCounter();

    wishItems.forEach((item, index) => {
        const timerId = setTimeout(() => {
            if (!isOpen) return;

            item.classList.add("revealed");
            wishesRevealed = index + 1;
            updateWishCounter();

            const rect = item.getBoundingClientRect();

            burstConfetti(
                rect.left + rect.width / 2,
                rect.top + rect.height / 2,
                20
            );
        }, 520 + index * 170);

        wishTimers.push(timerId);
    });

    balloonStartTimer = setTimeout(() => {
        if (isOpen) {
            startBalloons();
        }
    }, 1200);
}

function replayCard() {
    if (!card) return;

    clearCardTimers();

    isOpen = false;
    wishesRevealed = 0;

    card.classList.remove("is-open");
    openButton?.setAttribute("aria-expanded", "false");

    updateWishCounter();
    cleanupBalloons();
    stopConfetti();

    document.querySelectorAll(".wishes li").forEach((item) => {
        item.classList.remove("revealed");
    });

    replayTimer = setTimeout(openCard, 260);
}

function handleGiftClick() {
    if (!giftBox) return;

    const rect = giftBox.getBoundingClientRect();

    burstConfetti(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
        100
    );

    giftBox.classList.add("gift-opened");

    setTimeout(() => {
        giftBox.hidden = true;
    }, 1200);

    openCard();
}

function handleMusicToggle() {
    if (!musicToggle) return;

    const nowPlaying = toggleMusic();

    if (musicIcon) {
        musicIcon.textContent = nowPlaying ? "🔊" : "🔇";
    }

    musicToggle.setAttribute(
        "aria-label",
        nowPlaying ? "Выключить музыку" : "Включить музыку"
    );

    musicToggle.setAttribute("aria-pressed", String(nowPlaying));
}

function handleSceneClick(event) {
    if (!isOpen) return;
    if (!(event.target instanceof Element)) return;

    if (
        event.target.closest(
            "button, .card__cover, .gift-box, .music-toggle"
        )
    ) {
        return;
    }

    burstConfetti(event.clientX, event.clientY, 40);
}

function handleKeydown(event) {
    const target = event.target;
    const key = event.key.toLowerCase();

    if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        target?.isContentEditable
    ) {
        return;
    }

    if (
        openButton === document.activeElement &&
        (event.key === "Enter" || event.key === " ")
    ) {
        event.preventDefault();
        openCard();
        return;
    }

    if (key === "o") {
        openCard();
    } else if (key === "r") {
        replayCard();
    } else if (key === "c") {
        burstConfetti(
            window.innerWidth / 2,
            window.innerHeight / 2,
            60
        );
    } else if (key === "m") {
        handleMusicToggle();
    }
}

function init() {
    if (
        !card ||
        !openButton ||
        !replayButton ||
        !giftBox ||
        !musicToggle
    ) {
        console.error("Не найдены обязательные элементы открытки.");
        return;
    }

    applyConfig();

    openButton.setAttribute("aria-expanded", "false");
    musicToggle.setAttribute("aria-pressed", "false");

    initConfetti(document.querySelector(".confetti"));
    initSparkles(document.querySelector(".sparkle-canvas"));
    initBalloons(document.getElementById("balloonsContainer"));

    openButton.addEventListener("click", openCard);
    replayButton.addEventListener("click", replayCard);
    giftBox.addEventListener("click", handleGiftClick);
    musicToggle.addEventListener("click", handleMusicToggle);

    document.addEventListener("click", handleSceneClick);
    document.addEventListener("keydown", handleKeydown);

    if (new URLSearchParams(window.location.search).get("open") === "1") {
        replayTimer = setTimeout(openCard, 250);
    }
}

document.addEventListener("DOMContentLoaded", init);
