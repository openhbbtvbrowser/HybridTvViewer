// compiled and injected into dom by webpack
import "../css/hbb-extension-content-ui.scss";

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
    if (fileref){
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}

// inject hbbtv polyfill
var s = document.createElement('script');
s.src = chrome.runtime.getURL('hbbtv_polyfill.js');
// after polyfill has been loaded load the rest of the hbbtv plugin ui.. e.g.: the remote control
s.onload = function () {
    // this.remove(); // remove
    // inject external user interfacess
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
    document.body.style["font-family"] = "Tiresias";
} else {
    document.addEventListener("DOMContentLoaded", () => {
        document.body.style["font-family"] = "Tiresias";
    });
}

