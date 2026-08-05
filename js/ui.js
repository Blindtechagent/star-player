import {getSetting,setSetting} from "./storage.js";

const screens={
    home:document.getElementById("homeScreen"),
    player:document.getElementById("playerScreen"),
    settings:document.getElementById("settingsScreen"),
    contact:document.getElementById("contactScreen"),
    about:document.getElementById("aboutScreen"),
    privacy:document.getElementById("privacyScreen")
};

const drawer=document.getElementById("navigationDrawer");
const overlay=document.getElementById("drawerOverlay");
const menuButton=document.getElementById("menuButton");
const liveRegion=document.getElementById("liveRegion");
const fab=document.getElementById("openFileButton");
const fabText=document.getElementById("fabText");

let currentScreen="home";

export function announce(message){

    liveRegion.textContent="";

    setTimeout(()=>{
        liveRegion.textContent=message;
    },50);

}

export function openDrawer(){

    drawer.classList.add("open");
    overlay.classList.add("active");

    drawer.setAttribute("aria-hidden","false");
    overlay.setAttribute("aria-hidden","false");

    menuButton.setAttribute("aria-expanded","true");

    announce("Navigation menu opened");

}

export function closeDrawer(){

    drawer.classList.remove("open");
    overlay.classList.remove("active");

    drawer.setAttribute("aria-hidden","true");
    overlay.setAttribute("aria-hidden","true");

    menuButton.setAttribute("aria-expanded","false");
    menuButton.focus();

}

export function toggleDrawer(){

    if(drawer.classList.contains("open")){
        closeDrawer();
    }else{
        openDrawer();
    }

}

export function showScreen(name){

    Object.values(screens).forEach(screen=>{
        screen.classList.add("hidden");
    });

    screens[name].classList.remove("hidden");

    currentScreen=name;

    closeDrawer();

    const heading=screens[name].querySelector("h2");

    if(heading){
        announce(heading.textContent);
    }

}

export function showHome(){

    showScreen("home");

}

export function showPlayer(){

    showScreen("player");

    setFabMode(true);

}

export function getCurrentScreen(){

    return currentScreen;

}

export function setFabMode(mediaLoaded){

    if(mediaLoaded){

        fabText.textContent="Open Another File";

        fab.setAttribute(
            "aria-label",
            "Open another audio or video file"
        );

    }else{

        fabText.textContent="Open File";

        fab.setAttribute(
            "aria-label",
            "Open audio or video file"
        );

    }

}

export function loadTheme(){

    const theme=getSetting("theme");

    document.documentElement.dataset.theme=theme;

    const radio=document.querySelector(
        `input[name="theme"][value="${theme}"]`
    );

    if(radio){
        radio.checked=true;
    }

}

export function saveTheme(theme){

    document.documentElement.dataset.theme=theme;

    setSetting("theme",theme);

    announce(`${theme} theme selected`);

}

export function initializeUI(){

    loadTheme();

    menuButton.addEventListener("click",toggleDrawer);

    overlay.addEventListener("click",closeDrawer);

    document.addEventListener("keydown",event=>{

        if(event.key==="Escape"){
            closeDrawer();
        }

    });

    document.getElementById("settingsButton")
        .addEventListener("click",()=>showScreen("settings"));

    document.getElementById("contactButton")
        .addEventListener("click",()=>showScreen("contact"));

    document.getElementById("aboutButton")
        .addEventListener("click",()=>showScreen("about"));

    document.getElementById("privacyButton")
        .addEventListener("click",()=>showScreen("privacy"));

    document
        .querySelectorAll('input[name="theme"]')
        .forEach(radio=>{

            radio.addEventListener("change",()=>{

                saveTheme(radio.value);

            });

        });

    setFabMode(false);

}