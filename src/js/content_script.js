
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

/**
 * Delete the original page content and create a new page where the original url is loaded into an iframe again.
 * Background script injects the polyfill there.
 * In this parent window we add plugin related stuff and messsage handling to 
 */
function initialize() {


    new Promise((res, rej) => {
        // get currentTab
        chrome.tabs.query({ active: true, currentWindow: true }, res);
    }).then((tabs) => {
        const tabId = tabs[0].id
        return new Promise((res, rej) => {
            sendMessage({ type: "getLocation", tabId }, (response) => {
                res(response);
            })
        })
    }).then((url) => {
        var iframe = document.createElement('iframe');
        iframe.id = "iframe-plugin"
        iframe.src = url;
        iframe.allow = "autoplay";
        document.body.appendChild(iframe);

        loadJsCssFile("plugin-extensions.js", "js");
    })
    /*
        const url = window.location.href;
        const htmlElement = document.documentElement;
        while (htmlElement.firstChild) {
            htmlElement.removeChild(htmlElement.firstChild);
        }
        const head = document.createElement("head");
        htmlElement.appendChild(head);
        const body = document.createElement("body");
        htmlElement.appendChild(body);
        body.style = "margin:0;padding:0";
        //document.getElementsByTagName("html")[0].style.setProperty("overflow", "visible","important");
    
        body.addEventListener("click", (e) => {
            iframe.classList.remove("focused");
        }, false);
    
        var iframe = document.createElement('iframe');
        iframe.id = "iframe-plugin"
        iframe.src = url;
        iframe.allow = "autoplay";
    
        document.body.appendChild(iframe);    
        iframe.contentWindow.addEventListener("click", (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            iframe.classList.add("focused");
        });
        loadJsCssFile("plugin-extensions.js", "js");
        loadJsCssFile("plugin-extensions.js", "js");
        */
}
