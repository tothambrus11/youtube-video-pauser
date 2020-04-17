console.log("Youtube pauser activated.");
let videoElement;
let enabled = false;


chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    console.log(data);
    if (data.type === "updateEnabled") {
        enabled = data.enabled;
        console.log("ENABLED: " + enabled);
    }
});


const getEnabled = () => {
    return new Promise(resolve => {
        chrome.storage.local.get("enabled", (data) => {
            enabled = data.enabled;
            resolve();
        })
    });
};

const waitForLoad = () => {
    return new Promise(resolve => {
        window.addEventListener("load", () => {
            resolve();
        });
    })
};

const main = async () => {
    await Promise.all([getEnabled(), waitForLoad()]);
    videoElement = document.getElementsByTagName("video")[0];
    videoElement.onplay = () => {
        hasPaused = false;
    };
    if (enabled) {
        console.log("EXTENSION STARTED");
    } else {
        console.log("EXTENSION DISABLED");
    }
};

main();

let hasPaused = false;

window.addEventListener('scroll', e => {
    if (window.scrollY >= window.innerHeight) {
        if (videoElement && !hasPaused && enabled) {
            videoElement.pause();
            hasPaused = true;
        }
    }
});


