const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const volUp = document.getElementById('volUp');
const volDown = document.getElementById('volDown');
const productImage = document.getElementById('productImage');
const audioPanel = document.getElementById('audioPanel');
const progressBar = document.querySelector('.progress-bar');

let hideTimeout = null;

/* ===== progress ring setup ===== */
const radius = progressBar.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

progressBar.style.strokeDasharray = circumference;
progressBar.style.strokeDashoffset = circumference;

/* ===== show / hide ===== */

function showPlayer() {
    audioPanel.classList.remove('hidden');

    if (audio.paused) {
        startAutoHide();
    }
}

function hidePlayer() {
    audioPanel.classList.add('hidden');
    clearTimeout(hideTimeout);
}

function startAutoHide() {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        if (audio.paused) {
            hidePlayer();
        }
    }, 5000);
}

/* ===== click image ===== */

productImage.addEventListener('click', () => {
    if (audioPanel.classList.contains('hidden')) {
        showPlayer();
    } else {
        hidePlayer();
    }
});

/* ===== play / pause ===== */

playBtn.addEventListener('click', () => {

    if (audio.paused) {
        audio.play();
        playBtn.textContent = "❚❚";
        playBtn.classList.add('playing');
        hidePlayer();
    } else {
        audio.pause();
        playBtn.textContent = "▶";
        playBtn.classList.remove('playing');
        showPlayer();
    }

});

/* ===== update progress ===== */

audio.addEventListener('timeupdate', () => {

    if (!audio.duration) return;

    const progress = audio.currentTime / audio.duration;
    const offset = circumference * (1 - progress);

    progressBar.style.strokeDashoffset = offset;
});

/* ===== reset when ended ===== */

audio.addEventListener('ended', () => {
    playBtn.textContent = "▶";
    playBtn.classList.remove('playing');
    progressBar.style.strokeDashoffset = circumference;
    showPlayer();
});

/* ===== volume ===== */

volUp.addEventListener('click', () => {
    audio.volume = Math.min(1, audio.volume + 0.1);
});

volDown.addEventListener('click', () => {
    audio.volume = Math.max(0, audio.volume - 0.1);
});
