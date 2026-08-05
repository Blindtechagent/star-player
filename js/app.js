import {initializeUI} from "./ui.js";
import {initializePlayer} from "./player.js";

const openFileButton=document.getElementById("openFileButton");
const mediaPicker=document.getElementById("mediaPicker");

function initializeApplication(){

    initializeUI();

    initializePlayer();

    openFileButton.addEventListener("click",()=>{

        mediaPicker.click();

    });

}

document.addEventListener("DOMContentLoaded",initializeApplication);