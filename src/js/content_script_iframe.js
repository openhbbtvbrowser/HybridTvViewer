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

function setupAndLoad(response) {
    // inject channel config and user agent from plugin settings into iframe
    // use helper namespace
    var setupPolyfillJs = `Object.defineProperty(navigator, 'userAgent', {
        value: '${response.userAgent || navigator.userAgent}'
    });
    window.HBBTV_POLYFILL_NS = window.HBBTV_POLYFILL_NS || {};
    window.HBBTV_POLYFILL_NS.currentChannel = ${JSON.stringify(response.currentChannel)};
    console.log('${JSON.stringify(response)}');
    `;
    var newScript = document.createElement("script");
    var inlineScript = document.createTextNode(setupPolyfillJs);
    newScript.appendChild(inlineScript);
    document.getElementsByTagName("head")[0].appendChild(newScript);

    // inject hbbtv polyfill
    var s = document.createElement('script');
    s.src = chrome.runtime.getURL('hbbtv_polyfill.js');
    // after polyfill has been loaded, load the rest of the hbbtv plugin.
    s.onload = function () {
        // inject extension functionality - e.g. gluecode between extension parent view and iframe
        loadJsCssFile("in-page-extensions.js", "js");
    };
    (document.head || document.documentElement).appendChild(s);

    // inject hbbtv font
    // Note: Tiresias Screenfont as defined for HbbTv is not license free --> we use the "similar" GNU License released Tiresias PC font
    const fontlocation = chrome.runtime.getURL("TiresiasPCfont.ttf");
    let font1 = new FontFace("Tiresias", "url(" + fontlocation + ")"); // selected by font-family:"Tiresias"
    let font2 = new FontFace("Tiresias Signfont", "url(" + fontlocation + ")");
    let font3 = new FontFace("Tiresias Screenfont", "url(" + fontlocation + ")");
    let font4 = new FontFace("TiresiasScreenfont", "url(" + fontlocation + ")");
    document.fonts.add(font1);
    document.fonts.add(font2);
    document.fonts.add(font3);
    document.fonts.add(font4);
    if (document && document.body) {
        if (window == window.top) {
            document.body.style["font-family"] = "Tiresias";
        }
    } else {
        document.addEventListener("DOMContentLoaded", () => {
            document.body.style["font-family"] = "Tiresias";
        });
    }
}
sendMessage({ type: "getPolyfillBaseConfig" }, setupAndLoad)
