let currentDefaultVolume = 0.5;

function createVideoPlayerDiv(videoUrl, audioUrl) {

    let player = document.createElement("div");
    player.className = "post_player post_element no_click_passthrough";

    let video = document.createElement("video");
    video.className = "player_video no_click_passthrough";
    video.preload = "auto";
    video.loop = "loop";
    video.volume = "0";
    video.src = videoUrl;
    player.appendChild(video);
    player.currentTime = 0;
    video.onloadeddata = () => {
        player.duration = video.duration;
    }
    video.onclick = () => { player.togglePause(); }

    let audio = document.createElement("audio");
    player.appendChild(audio);

    if (audioUrl !== undefined) {
        fetch(audioUrl).then(res => res.text()).then(t => {
            if (!t.includes("AccessDenied")) {
                audio.className = "player_audio";
                audio.style.display = "none";
                audio.preload = "auto";
                audio.loop = "loop";
                audio.volume = "0";
                audio.src = audioUrl;
            } else {
                audio.remove();
            }
        })
    }

    let controls = createControlsDiv(player);
    player.appendChild(controls);

    player.onvolumechange = (volume) => {
        log("Volume change: " + volume);
        if (volume > 0)
            currentDefaultVolume = volume;
        if (audioUrl !== undefined) {
            audio.volume = volume;
        } else {
            video.volume = volume;
        }
    }

    player.ontimechange = (percent) => {
        log("Time change");
        player.currentTime = player.duration * percent;
        video.currentTime = player.currentTime;
        if (audioUrl !== undefined)
            audio.currentTime = player.currentTime;
    }

    //Functions
    player.play = () => {
        log("Play");
        startTimer();
        video.play();
        audio?.play();
    }

    player.pause = () => {
        log("Pause");
        stopTimer();
        video.pause();
        audio?.pause();
    }

    player.setVolume = (value) => {
        log("Set volume: " + value);
        player.getElementsByClassName("player_volume_slider")[0].setVolume(value);
    }

    player.toggleMute = () => {
        log("Toggle mute");
        player.getElementsByClassName("player_mute")[0].toggle();
    }

    player.togglePause = () => {
        log("Toggle pause");
        player.getElementsByClassName("player_playpause")[0].toggle();
    }

    player.onmouseenter = () => {
        player.getElementsByClassName("player_controls")[0].style.display = "flex";
    }

    player.onmouseleave = () => {
        player.getElementsByClassName("player_controls")[0].style.display = "none";
    }

    player.classList.add("playing");
    return player;

    function createControlsDiv(player) {
        let controls = document.createElement("div");
        controls.className = "player_controls no_click_passthrough";
        controls.appendChild(createPlayPauseDiv(player));
        controls.appendChild(createTimeDiv(player));
        controls.appendChild(createVolumeDiv(player));
        return controls;
    }

    function createPlayPauseDiv(player) {
        let playPause = document.createElement("div");
        playPause.className = "player_playpause no_click_passthrough";
        playPause.toggle = () => {
            if (player.classList.contains("playing")) {
                playPause.classList.add("paused");
                player.classList.remove("playing");
                player.pause();
            } else {
                playPause.classList.remove("paused");
                player.classList.add("playing");
                player.play();
            }
        }
        playPause.onclick = playPause.toggle;
        return playPause;
    }

    function createVolumeDiv(player) {

        let volume = document.createElement("div");
        volume.className = "player_volume no_click_passthrough";

        let volumeSlider = document.createElement("input");
        volumeSlider.className = "player_volume_slider no_click_passthrough";
        volumeSlider.type = "range";
        volumeSlider.min = "0";
        volumeSlider.max = "1";
        volumeSlider.step = "0.01";
        volumeSlider.value = "0";
        volumeSlider.setVolume = (v) => { volumeSlider.value = v; player.onvolumechange(v); }
        volumeSlider.onchange = (ev) => {
            player.onvolumechange(ev.target.value);
        }
        volume.appendChild(volumeSlider);

        let mute = document.createElement("div");
        mute.className = "player_mute no_click_passthrough";
        mute.toggle = () => {
            if (volumeSlider.value == "0") {
                volumeSlider.setVolume(currentDefaultVolume);
            } else {
                volumeSlider.setVolume(0);
            }
        }
        volume.appendChild(mute);

        return volume;
    }

    function createTimeDiv(player) {
        let time = document.createElement("div");
        time.className = "player_time no_click_passthrough";

        let timeSlider = document.createElement("input");
        timeSlider.className = "player_time_slider no_click_passthrough";
        timeSlider.type = "range";
        timeSlider.min = "0";
        timeSlider.max = "1";
        timeSlider.step = "0.001";
        timeSlider.value = "0";
        timeSlider.onchange = (ev) => {
            player.ontimechange(ev.target.value);
        }

        time.appendChild(timeSlider);
        return time;
    }

    function timeSyncer(slider) {
        let percent = video.currentTime / video.duration;
        slider.value = percent;
    }

    function startTimer() {
        if (!player.timer) {
            player.timer = setInterval(timeSyncer, 1000, player.getElementsByClassName("player_time_slider")[0]);
        }
    }

    function stopTimer() {
        if (player.timer) {
            clearInterval(player.timer);
            player.timer = undefined;
        }
    }
}