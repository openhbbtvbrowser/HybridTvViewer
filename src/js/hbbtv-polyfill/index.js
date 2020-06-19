import { keyEventInit } from "./keyevent-init.js";
import { hbbtvFn } from "./hbbtv.js";
import { VideoHandler } from "./hbb-video-handler.js";

var _DEBUG_ = false;

function init() {
    _DEBUG_ && console.log("hbbtv-polyfill: load");

    window.signalopenhbbtvbrowser = function(command) {
        document.title = command;
    }

    // intercept XMLHttpRequest
    let cefOldXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        // do something with the method, url and etc.
        _DEBUG_ && console.log("XMLHttpRequest.method: " + method);
        _DEBUG_ && console.log("XMLHttpRequest.async: "  + async);
        _DEBUG_ && console.log("XMLHttpRequest.url: "    + url);

        url = window.cefXmlHttpRequestQuirk(url);

        _DEBUG_ && console.log("XMLHttpRequest.newurl: " + url);
        this.addEventListener('load', function() {
            // do something with the response text
            _DEBUG_ && console.log('XMLHttpRequest: url ' + url + ', load: ' + this.responseText);
        });

        return cefOldXHROpen.call(this, method, url, async, user, password);
    }

    // global helper namespace to simplify testing
    window.HBBTV_POLYFILL_NS = window.HBBTV_POLYFILL_NS || {
    };
    window.HBBTV_POLYFILL_NS = {
        ...window.HBBTV_POLYFILL_NS, ...{
            keysetSetValueCount: 0,
            streamEventListeners: [],
        }
    };
    window.HBBTV_POLYFILL_NS.currentChannel = window.HBBTV_POLYFILL_NS.currentChannel || {
        'TYPE_TV': 12,
        'channelType': 12,
        'sid': 1,
        'onid': 1,
        'tsid': 1,
        'name': 'test',
        'ccid': 'ccid:dvbt.0',
        'dsd': ''
    };
    window.HBBTV_POLYFILL_NS.preferredLanguage = window.HBBTV_POLYFILL_NS.preferredLanguage || 'DEU';

    // set body position
    document.body.style.position = "absolute";
    document.body.style.width = "1280px";
    document.body.style.height = "720px";

    keyEventInit();
    hbbtvFn();

    new VideoHandler().initialize();

    _DEBUG_ && console.log("hbbtv-polyfill: loaded");
}
if (!document.body) {
    document.addEventListener("DOMContentLoaded", init);
} else {
    init();
}
