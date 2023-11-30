const tracks = document.querySelectorAll("audio");
const volumeControls = document.querySelectorAll(".volume-control");
const play = document.getElementById("play-all-button");
const progressBars = document.querySelectorAll("progress");
const articles = document.querySelectorAll("article");
const icons = document.querySelectorAll("img");
const check = document.getElementById("late-game-check");
const loadingSection = document.getElementById("loading");
const muteAll = document.getElementById("muteall");

const early = document.getElementById("early-tracks");
const late = document.getElementById("late-tracks");

// Trigger loading of the audio files
function loadAudios() {
  let loadedCount = 0; // count of audios that have loaded
  tracks.forEach((track, index) => {
    // Listen for the 'canplaythrough' event which means the audio is ready to play
    track.addEventListener(
      "canplaythrough",
      function () {
        console.log(`Audio ${index + 1} can play through.`);
        loadedCount++;
        if (loadedCount === tracks.length) {
          console.log("All audio files can play through.");
          loadingSection.style.display = "none";
        }
      },
      { once: true }
    );

    // Listen for errors in loading the audio
    track.addEventListener(
      "error",
      function () {
        console.error(`Error loading audio ${index + 1}.`);
      },
      { once: true }
    );

    // Attempt to load the audio file
    track.load();
  });
}

// Call loadAudios on page load
window.addEventListener("load", loadAudios);

function allAudiosLoaded() {
  const allLoaded = Array.from(tracks).every((track) => track.readyState >= 4);
  if (allLoaded) {
    loadingSection.style.display = "none";
  }
}
// Add event listeners to each track for the 'canplaythrough' event
tracks.forEach((track) => {
  track.addEventListener("canplaythrough", allAudiosLoaded, { once: true });
});

check.addEventListener("change", (event) => {
  tracks.forEach((track) => {
    track.pause();
    track.currentTime = 0;
    track.volume = 0;
    play.innerHTML = "Play All";
  });
  volumeControls.forEach((control, i) => {
    control.value = 0;
  });

  event.preventDefault();
  if (check.checked) {
    // console.log("Checkbox is checked..");
    early.style.display = "none";
    late.style.display = "flex";
  } else {
    // console.log("Checkbox is not checked..");
    early.style.display = "flex";
    late.style.display = "none";
  }
});

volumeControls.forEach((control, i) => {
  control.addEventListener("input", () => {
    if (tracks[i].muted) {
      tracks[i].muted = false;
    }
    tracks[i].volume = control.value;
  });
});
play.addEventListener("click", (event) => {
  event.preventDefault();
  tracks.forEach((track) => {
    if (track.paused) {
      track.play();
      play.innerHTML = "Pause All";
      //   console.log(track.currentTime);
    } else {
      track.pause();
      play.innerHTML = "Play All";
    }
  });
});
muteAll.addEventListener("click", (event) => {
  event.preventDefault();
  tracks.forEach((track) => {
    track.volume = 0;
  });
  volumeControls.forEach((control, i) => {
    control.value = 0;
  });
});

tracks.forEach((track, index) => {
  track.addEventListener("timeupdate", () => {
    const progress = (track.currentTime / track.duration) * 100;
    progressBars[index].value = progress;
  });
  track.addEventListener("volumechange", () => {
    if (tracks[index].muted || tracks[index].volume === 0) {
      articles[index].style.backgroundColor = "#091224";
      progressBars[index].style.setProperty(
        "--progress-bg",
        "grey"
      );
    } else {
      articles[index].style.backgroundColor = "#082c3e";
      progressBars[index].style.setProperty(
        "--progress-bg",
        "linear-gradient(90deg, #005A82, #0AC8B9)"
      );
    }
  });
});

progressBars.forEach((progressBar, i) => {
  progressBar.addEventListener("click", (event) => {
    event.preventDefault();
    //Calculate new time
    const bar = progressBar.getBoundingClientRect();
    // console.log(bar);
    const percent = (event.clientX - bar.left) / bar.width;
    // console.log(percent);
    const newTime = Math.round(tracks[i].duration * percent);
    // console.log(newTime);

    //Apply new time
    tracks.forEach((track) => {
      track.currentTime = newTime;
    });
  });
});
