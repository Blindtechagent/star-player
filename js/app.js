const openFileButton=document.getElementById("openFileButton");
const toolbarOpenFileButton=document.getElementById("toolbarOpenFileButton");
const mediaPicker=document.getElementById("mediaPicker");

function initializeApplication(){

    initializeUI();

    initializePlayer();

    if (openFileButton) {
        openFileButton.addEventListener("click",()=>{
            mediaPicker.click();
        });
    }

    if (toolbarOpenFileButton) {
        toolbarOpenFileButton.addEventListener("click",()=>{
            mediaPicker.click();
        });
    }

}

document.addEventListener("DOMContentLoaded",initializeApplication);