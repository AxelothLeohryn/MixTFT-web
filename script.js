const tracks = document.querySelectorAll("audio");
const volumeControls = document.querySelectorAll(".volume-control");
const play = document.getElementById("play-all-button");
const progressBars = document.querySelectorAll("progress");
const articles = document.querySelectorAll("article");
const icons = document.querySelectorAll("img");

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
      //   console.log(track.currentTime);
    } else {
      track.pause();
    }
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
    } else {
      articles[index].style.backgroundColor = "#082c3e";
    }
  });
});

progressBars.forEach((progressBar, i) => {
  progressBar.addEventListener("click", (event) => {
    event.preventDefault();
    //Calculate new time
    const bar = progressBar.getBoundingClientRect();
    console.log(bar);
    const percent = (event.clientX - bar.left) / bar.width;
    console.log(percent);
    const newTime = Math.round(tracks[i].duration * percent);
    console.log(newTime);

    //Apply new time
    tracks.forEach((track) => {
      track.currentTime = newTime;
    });
  });
});
