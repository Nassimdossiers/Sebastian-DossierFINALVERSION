// ==========================
// TAB SWITCHING + SELECTIVE MP3 SYSTEM
// ==========================

const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tabcontent");
const bgMusic = document.getElementById("bgMusic");

// ONLY these tabs will use MP3
const musicMap = {
  lore: "DARKLINE.mp3",
  stats: "CIANOTIPO.mp3",
  relationships: "AfterTheRain.mp3"
};

let currentTrack = null;

// Fade out function
function fadeOut(audio, duration = 400) {
  return new Promise(resolve => {
    const step = audio.volume / (duration / 50);
    const fade = setInterval(() => {
      audio.volume = Math.max(0, audio.volume - step);
      if (audio.volume <= 0) {
        clearInterval(fade);
        audio.pause();
        resolve();
      }
    }, 50);
  });
}

// Fade in function
function fadeIn(audio, duration = 400) {
  audio.volume = 0;
  const step = 1 / (duration / 50);
  const fade = setInterval(() => {
    audio.volume = Math.min(1, audio.volume + step);
    if (audio.volume >= 1) {
      clearInterval(fade);
    }
  }, 50);
}

async function switchMusic(tabName) {

  // If tab is NOT one of the MP3 ones → stop our bgMusic and do nothing else
  if (!musicMap[tabName]) {
    if (!bgMusic.paused) {
      await fadeOut(bgMusic);
    }
    currentTrack = null;
    return;
  }

  const newTrack = musicMap[tabName];

  if (newTrack === currentTrack) return;

  await fadeOut(bgMusic);

  bgMusic.src = newTrack;
  currentTrack = newTrack;

  try {
    await bgMusic.play();
    fadeIn(bgMusic);
  } catch (err) {
    console.warn("Autoplay blocked until user interaction.");
  }
}

// Tab click logic
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    tabContents.forEach(c => c.classList.remove("active"));
    document.getElementById(target).classList.add("active");

    switchMusic(target);
  });
});