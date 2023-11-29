const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let tracksBuffer = []; // Array to store the audio buffers

async function loadTrack(url, index) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    tracksBuffer[index] = await audioCtx.decodeAudioData(arrayBuffer);
}

loadTrack('./assets/pentakill_late.mp3', 0);
loadTrack('./assets/jhin_late.mp3', 1);

let sources = [];
let isPlaying = false;

function togglePlayPause() {
    if (!isPlaying) {
        sources = tracksBuffer.map(buffer => {
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            return source;
        });

        const startTime = audioCtx.currentTime;
        sources.forEach(source => source.start(startTime));
        isPlaying = true;
    } else {
        sources.forEach(source => source.stop());
        isPlaying = false;
    }
}

// Attach this function to your play button
play.addEventListener('click', togglePlayPause);


progressBars.forEach((progressBar, i) => {
    progressBar.addEventListener('click', (event) => {
        const bar = progressBar.getBoundingClientRect();
        const percent = (event.clientX - bar.left) / bar.width;
        const newTime = percent * tracksBuffer[i].duration;

        if (isPlaying) {
            // Stop current playback
            sources.forEach(source => source.stop());
        }

        // Start playback from new time
        sources = tracksBuffer.map(buffer => {
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            return source;
        });

        const startTime = audioCtx.currentTime - newTime;
        sources.forEach(source => source.start(startTime));
    });
});