const mediaHost=document.getElementById("mediaHost");
const picker=document.getElementById("mediaPicker");

const playButton=document.getElementById("playPauseButton");
const stopButton=document.getElementById("stopButton");
const previousButton=document.getElementById("previousButton");
const nextButton=document.getElementById("nextButton");

const seekBar=document.getElementById("seekBar");
const volumeSlider=document.getElementById("volumeSlider");
const speedSelect=document.getElementById("playbackSpeed");

const mediaTitle=document.getElementById("mediaTitle");
const mediaArtist=document.getElementById("mediaArtist");

const artwork=document.getElementById("artworkImage");
const artworkPlaceholder=document.getElementById("artworkPlaceholder");

const currentTime=document.getElementById("currentTime");
const totalTime=document.getElementById("totalTime");

let player=null;
let objectUrl=null;
let currentFile=null;

function formatTime(seconds){

    if(isNaN(seconds)||seconds<0){
        return "00:00";
    }

    const minutes=Math.floor(seconds/60);
    const secs=Math.floor(seconds%60);

    return `${String(minutes).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;

}

function clearPlayer(){

    if(player){

        player.pause();

        player.remove();

        player=null;

    }

    if(objectUrl){

        URL.revokeObjectURL(objectUrl);

        objectUrl=null;

    }

}

const playPauseIcon=document.getElementById("playPauseIcon");

function createMediaElement(file){

    clearPlayer();

    objectUrl=URL.createObjectURL(file);
    const artworkContainer=document.getElementById("artworkContainer");

    if(file.type.startsWith("video/")){

        player=document.createElement("video");

        player.style.width="100%";

        player.style.borderRadius="16px";
        
        mediaHost.removeAttribute("hidden");
        if(artworkContainer) {
            artworkContainer.classList.add("hidden");
        }

    }else{

        player=document.createElement("audio");
        
        mediaHost.setAttribute("hidden", "true");
        if(artworkContainer) {
            artworkContainer.classList.remove("hidden");
        }

    }

    player.src=objectUrl;
    player.preload="metadata";
    player.controls=false;

    mediaHost.innerHTML="";
    mediaHost.appendChild(player);

    restorePlayerSettings();

    registerMediaEvents();

}

function restorePlayerSettings(){

    const volume=getSetting("volume");
    const speed=getSetting("playbackSpeed");

    volumeSlider.value=volume;
    speedSelect.value=String(speed);

    if(player){

        player.volume=volume/100;
        player.playbackRate=speed;

    }

}

function updateMediaDetails(file){

    currentFile=file;

    mediaTitle.textContent=file.name;

    mediaArtist.textContent="Unknown Artist";

    artwork.hidden=true;

    artwork.removeAttribute("src");

    artworkPlaceholder.hidden=false;

}

function registerMediaEvents(){

    player.addEventListener("loadedmetadata",()=>{

        totalTime.textContent=formatTime(player.duration);

        seekBar.max=Math.floor(player.duration);

        seekBar.value=0;

    });

    player.addEventListener("timeupdate",()=>{

        currentTime.textContent=formatTime(player.currentTime);

        seekBar.value=Math.floor(player.currentTime);

    });

    player.addEventListener("play",()=>{

        if(playPauseIcon) {
            playPauseIcon.textContent="⏸";
        } else {
            playButton.firstChild.textContent="⏸";
        }

        playButton.lastElementChild.textContent="Pause";

        playButton.setAttribute("aria-label","Pause");

    });

    player.addEventListener("pause",()=>{

        if(playPauseIcon) {
            playPauseIcon.textContent="▶";
        } else {
            playButton.firstChild.textContent="▶";
        }

        playButton.lastElementChild.textContent="Play";

        playButton.setAttribute("aria-label","Play");

    });

    player.addEventListener("ended",()=>{

        player.currentTime=0;

        announce("Playback finished");

    });

    player.addEventListener("error",()=>{

        announce("Unable to play this media file.");

    });

}

function openMedia(file){

    createMediaElement(file);

    updateMediaDetails(file);

    showPlayer();

    setFabMode(true);

    announce(`${file.name} selected`);

}

function playPause(){

    if(!player){
        return;
    }

    if(player.paused){

        player.play()
            .catch(()=>{
                announce("Unable to start playback.");
            });

    }else{

        player.pause();

    }

}

function stop(){

    if(!player){
        return;
    }

    player.pause();
    player.currentTime=0;

    announce("Playback stopped");

}

function seek(){

    if(!player){
        return;
    }

    player.currentTime=Number(seekBar.value);

}

function changeVolume(){

    if(!player){
        return;
    }

    const volume=Number(volumeSlider.value);

    player.volume=volume/100;

    setSetting("volume",volume);

}

function changePlaybackSpeed(){

    if(!player){
        return;
    }

    const speed=Number(speedSelect.value);

    player.playbackRate=speed;

    setSetting("playbackSpeed",speed);

    announce(`Playback speed ${speed} times`);

}

function openSelectedFile(){

    if(!picker.files.length){
        return;
    }

    openMedia(picker.files[0]);

}

function registerControlEvents(){

    picker.addEventListener("change",openSelectedFile);

    playButton.addEventListener("click",playPause);

    stopButton.addEventListener("click",stop);

    previousButton.addEventListener("click",()=>{

        announce("Previous media is not available.");

    });

    nextButton.addEventListener("click",()=>{

        announce("Next media is not available.");

    });

    seekBar.addEventListener("input",seek);

    volumeSlider.addEventListener("input",changeVolume);

    speedSelect.addEventListener("change",changePlaybackSpeed);

}

function getCurrentMedia(){

    return currentFile;

}

function getPlayer(){

    return player;

}

function isMediaLoaded(){

    return player!==null;

}

function initializePlayer(){

    registerControlEvents();

    restorePlayerSettings();

}