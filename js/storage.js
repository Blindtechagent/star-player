const STORAGE_KEY="starPlayerSettings";

const DEFAULT_SETTINGS={
    theme:"light",
    volume:100,
    playbackSpeed:1
};

function readSettings(){

    try{

        const data=localStorage.getItem(STORAGE_KEY);

        if(!data){
            return {...DEFAULT_SETTINGS};
        }

        return{
            ...DEFAULT_SETTINGS,
            ...JSON.parse(data)
        };

    }catch(error){

        console.error(error);

        return {...DEFAULT_SETTINGS};

    }

}

function writeSettings(settings){

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(settings)
    );

}

export function getSettings(){

    return readSettings();

}

export function getSetting(key){

    return readSettings()[key];

}

export function setSetting(key,value){

    const settings=readSettings();

    settings[key]=value;

    writeSettings(settings);

}

export function resetSettings(){

    writeSettings(DEFAULT_SETTINGS);

}

export function initializeStorage(){

    if(!localStorage.getItem(STORAGE_KEY)){

        writeSettings(DEFAULT_SETTINGS);

    }

}