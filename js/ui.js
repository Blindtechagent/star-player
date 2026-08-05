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
const backButton=document.getElementById("backButton");
const headerTitle=document.getElementById("headerTitle");
const liveRegion=document.getElementById("liveRegion");
const toolbarOpenFileButton=document.getElementById("toolbarOpenFileButton");

let currentScreen="home";

function announce(message){
    liveRegion.textContent="";
    setTimeout(()=>{
        liveRegion.textContent=message;
    },50);
}

function openDrawer(){
    if (drawer && overlay) {
        drawer.classList.add("open");
        overlay.classList.add("active");
        drawer.setAttribute("aria-hidden","false");
        overlay.setAttribute("aria-hidden","false");
        if (menuButton) menuButton.setAttribute("aria-expanded","true");
        announce("Navigation menu opened");
    }
}

function closeDrawer(){
    if (drawer && overlay) {
        drawer.classList.remove("open");
        overlay.classList.remove("active");
        drawer.setAttribute("aria-hidden","true");
        overlay.setAttribute("aria-hidden","true");
        if (menuButton) {
            menuButton.setAttribute("aria-expanded","false");
            menuButton.focus();
        }
    }
}

function toggleDrawer(){
    if (drawer && drawer.classList.contains("open")){
        closeDrawer();
    }else{
        openDrawer();
    }
}

function showScreen(name){
    // Hide all screens
    Object.values(screens).forEach(screen=>{
        if (screen) screen.classList.add("hidden");
    });

    // Show target screen
    if (screens[name]) {
        screens[name].classList.remove("hidden");
    }

    currentScreen=name;
    closeDrawer();

    // Highlight active item in the drawer
    const drawerButtons = document.querySelectorAll(".drawer-button");
    drawerButtons.forEach(btn => {
        if (btn.id === `${name}Button`) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    // Update App Bar Title, Back Button, and Toolbar Actions
    if (name === "home" || name === "player") {
        if (backButton) backButton.classList.add("hidden");
        if (menuButton) menuButton.classList.remove("hidden");
        if (headerTitle) {
            headerTitle.textContent = name === "home" ? "Star Player" : "Now Playing";
        }
        
        // Show folder shortcut in top bar when on Player screen so they can open a new file
        if (toolbarOpenFileButton) {
            if (name === "player") {
                toolbarOpenFileButton.classList.remove("hidden");
            } else {
                toolbarOpenFileButton.classList.add("hidden");
            }
        }
    } else {
        // Show Back Button for sub-screens (Settings, Contact, About, Privacy)
        if (backButton) backButton.classList.remove("hidden");
        if (menuButton) menuButton.classList.add("hidden");
        if (toolbarOpenFileButton) toolbarOpenFileButton.classList.add("hidden");
        
        if (headerTitle) {
            if (name==="settings") headerTitle.textContent="Settings";
            if (name==="contact") headerTitle.textContent="Contact Support";
            if (name==="about") headerTitle.textContent="About Star Player";
            if (name==="privacy") headerTitle.textContent="Privacy Policy";
        }
    }

    const heading=screens[name] ? screens[name].querySelector("h2") : null;
    if(heading){
        announce(heading.textContent);
    } else if (headerTitle) {
        announce(headerTitle.textContent);
    }
}

function showHome(){
    showScreen("home");
}

function showPlayer(){
    showScreen("player");
    setFabMode(true);
}

function getCurrentScreen(){
    return currentScreen;
}

function setFabMode(mediaLoaded){
    const fabText = document.getElementById("fabText");
    const openFileButton = document.getElementById("openFileButton");
    
    if (fabText) {
        fabText.textContent = mediaLoaded ? "Open Another File" : "Open File";
    }
    if (openFileButton) {
        openFileButton.setAttribute("aria-label", mediaLoaded ? "Open another audio or video file" : "Open audio or video file");
    }
}

function loadTheme(){
    const theme=getSetting("theme");
    document.documentElement.dataset.theme=theme;

    const radio=document.querySelector(`input[name="theme"][value="${theme}"]`);
    if(radio){
        radio.checked=true;
    }
}

function saveTheme(theme){
    document.documentElement.dataset.theme=theme;
    setSetting("theme",theme);
    announce(`${theme} theme selected`);
}

function initializeUI(){
    loadTheme();

    // Drawer toggling events
    if (menuButton) menuButton.addEventListener("click", toggleDrawer);
    if (overlay) overlay.addEventListener("click", closeDrawer);

    // Back Button goes back to Home or Settings
    if (backButton) {
        backButton.addEventListener("click", () => {
            if (["contact", "about", "privacy"].includes(currentScreen)) {
                showScreen("settings");
            } else {
                showScreen("home");
            }
        });
    }

    // Android back key handling support
    document.addEventListener("keydown",event=>{
        if(event.key==="Escape" || event.key==="Backspace"){
            if (drawer && drawer.classList.contains("open")) {
                event.preventDefault();
                closeDrawer();
            } else if (["contact", "about", "privacy"].includes(currentScreen)) {
                event.preventDefault();
                showScreen("settings");
            } else if (currentScreen!=="home") {
                event.preventDefault();
                showScreen("home");
            }
        }
    });

    // Register drawer menu button listeners
    const homeBtn = document.getElementById("homeButton");
    const playerBtn = document.getElementById("playerButton");
    const settingsBtn = document.getElementById("settingsButton");
    const contactBtn = document.getElementById("contactButton");
    const aboutBtn = document.getElementById("aboutButton");
    const privacyBtn = document.getElementById("privacyButton");

    if (homeBtn) homeBtn.addEventListener("click", () => showScreen("home"));
    if (playerBtn) playerBtn.addEventListener("click", () => showScreen("player"));
    if (settingsBtn) settingsBtn.addEventListener("click", () => showScreen("settings"));
    if (contactBtn) contactBtn.addEventListener("click", () => showScreen("contact"));
    if (aboutBtn) aboutBtn.addEventListener("click", () => showScreen("about"));
    if (privacyBtn) privacyBtn.addEventListener("click", () => showScreen("privacy"));

    // Theme selector options listener
    document.querySelectorAll('input[name="theme"]').forEach(radio=>{
        radio.addEventListener("change",()=>{
            saveTheme(radio.value);
        });
    });

    setFabMode(false);
}