
if (document && document.body) {
    initialize();
} else {
    document.addEventListener("DOMContentLoaded", () => {
        initialize();
    });
}

// inject a css or js file into dom via tags
function loadJsCssFile(filename, filetype) {
    let fileref;
    if (filetype === "js") {
        fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        const name = chrome.runtime.getURL(filename);
        fileref.setAttribute("src", name);
    }
    else if (filetype === "css") {
        fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        const name = chrome.runtime.getURL(filename);
        fileref.setAttribute("href", name);
    }
    if (fileref) {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}

/**
 * Send message down the message bus. 
 * @param {*} messageObj 
 * @param {*} responseCallback 
 */
function sendMessage(messageObj, responseCallback) {
    chrome.runtime.sendMessage(messageObj, (response) => {
        responseCallback(response);
    });
}

function initialize() {
    new Promise((res, rej) => {
        sendMessage({ type: "getLocation" }, (response) => {
            res(response);
        })
    }).then((url) => {
        const overlay = document.getElementById("div-iframe-overlay");
        var iframe = document.createElement('iframe');
        iframe.id = "iframe-plugin"
        iframe.src = url;
        iframe.allow = "autoplay";

        document.body.addEventListener("click", (e) => {
            iframe.classList.remove("focused");
        }, false);

        document.body.appendChild(iframe);

        overlay.addEventListener("click", (e) => {
            e.stopImmediatePropagation();
            iframe.classList.add("focused");
            // set keyboard focus on iframe even if it is not clickable through overlay div
            iframe.focus();
        }, true);

        loadJsCssFile("plugin-extensions.js", "js");
    })
}
