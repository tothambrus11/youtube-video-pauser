window.onload = () => {
    let el = document.getElementById("isEnabledCB");
    //el.checked = localStorage.getItem("enabled") === null || localStorage.getItem("enabled") === "true";

    chrome.storage.local.get("enabled", (data) => {
        el.checked = data.enabled === null || data.enabled === true;
        console.log("ENABLED: " + data.enabled);
    });

    el.onchange = () => {
        console.log(el.checked);
        chrome.storage.local.set({"enabled": el.checked});

        chrome.windows.getAll(windows => {
            windows.forEach(win => {
                chrome.tabs.getAllInWindow(win.id, (tabs) => {
                    tabs.forEach(tab => {
                        chrome.tabs.sendMessage(tab.id, {type: "updateEnabled", enabled: el.checked});
                    });
                });
            });
        });

        chrome.runtime.sendMessage({type: "updateEnabled", enabled: el.checked});
    }
};
