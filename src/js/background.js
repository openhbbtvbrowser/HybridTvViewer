var knownMimeTypes = {
    'hbbtv': 'application/vnd.hbbtv.xhtml+xml',
    'cehtml': 'application/ce-html+xml',
    'ohtv': 'application/vnd.ohtv',
    'bml': 'text/X-arib-bml',
    'atsc': 'atsc-http-attributes'
    //'mheg': 'application/x-mheg-5',
    //'aitx': 'application/vnd.dvb.ait'
};

// known hbbtv tabs
const knownTabs = [];
// popups are loaded anew everytime the popup icon is clicked
// store the popups state for each tab
const popupStates = [];

// store tabs that are hbbtv tabs to knownTabsArray with url
var storeTabAndUrl = (tabId, url) => {
    knownTabs[tabId] = url;
};
var deleteTabFromHbbTvPlugin = (tabId) => {
    delete knownTabs[tabId];
}

/**
 * If url and tab indicate an hbbtv app inject hbbtv_polyfill into page.
 * Add this on completed DOM as we need to access to e.g. OIPF video objects.
 */
chrome.webNavigation.onCommitted.addListener((details) => {
    if ((knownTabs[details.tabId] && details.url.includes(knownTabs[details.tabId]))
        // Plugin has been enabled via popup -- make sure frameId === 0 as polyfill is sometimes loaded mutliple times for urls 
        // that shouldn't trigger onDOMContentLoaded.
        || popupStates[details.tabId] && popupStates[details.tabId].forcePlugin === true && details.frameId === 0
    ) { 
        // inject content_script_iframe into iframe
        if (details.parentFrameId === 0) { // inject into first level child frames
            console.log("exec content script in iframe", details);
            chrome.tabs.executeScript(details.tabId, {
                file: 'content_script_iframe.js',
                runAt: 'document_start',
                frameId: details.frameId,
            });
        }
        chrome.browserAction.setIcon({ tabId: details.tabId, path: "TV_active_128.png" });
    }
});

/**
 * Filter headers for hbbtv content-types.
 */
chrome.webRequest.onHeadersReceived.addListener((details) => {
    var url = (details.url || ''), headers = details.responseHeaders;
    if (url.indexOf('http') !== 0) { // if URL is not starting by http(s) then exit ...
        return {
            responseHeaders: headers
        };
    }
    headers.forEach(function (header) {
        var headerWithHbbtv = header.value.substring(0, knownMimeTypes.hbbtv.length) === knownMimeTypes.hbbtv ||
            header.name.toLowerCase().substring(0, knownMimeTypes.atsc.length) === knownMimeTypes.atsc;
        var headerWithCeHtml = header.value.substring(0, knownMimeTypes.cehtml.length) === knownMimeTypes.cehtml;
        var headerWithOhtv = header.value.substring(0, knownMimeTypes.ohtv.length) === knownMimeTypes.ohtv;
        var headerWithBml = header.value.substring(0, knownMimeTypes.bml.length) === knownMimeTypes.bml;
        switch (header.name.toLowerCase()) {
            case knownMimeTypes.atsc:
            case 'content-type':
                if (headerWithHbbtv || headerWithCeHtml || headerWithOhtv || headerWithBml) {
                    header.value = 'application/xhtml+xml'; // override current content-type to avoid browser automatic download
                    // store current url
                    storeTabAndUrl(details.tabId, url);
                    // reload the tab with the plugin.html
                    if (details.parentFrameId === -1) {
                        chrome.tabs.get(details.tabId, (tab) => {
                            chrome.tabs.update(tab.id, { url: "plugin.html" });
                        });
                    }
                }
                break;
        }
    });
    return {
        responseHeaders: headers
    };
},
    { urls: ['<all_urls>'] },
    ['blocking', 'responseHeaders'].concat(navigator.userAgent.includes('Chrom') ? chrome.webRequest.OnHeadersReceivedOptions.EXTRA_HEADERS : [])
);

/**
 * Listen for events from and content scripts.
 * {msg: {tabId, type, message}} - payload of the message, the tab of the requesting popup.
 */
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "getPopupState") {
        // get the tabs popup state
        const respose = popupStates[msg.tabId] ? popupStates[msg.tabId] : {};
        sendResponse(respose);
    }
    else if (msg.type === "getLocation") {
        // get the tabs original url
        sendResponse(knownTabs[msg.tabId]);
    }
    else if (msg.type === "setPopupState") {
        // the popup state changed - store it and reload the tab
        if (!popupStates[msg.tabId]) {
            popupStates[msg.tabId] = {};
        }
        popupStates[msg.tabId] = { ...popupStates[msg.tabId], ...msg.message };
        if (msg.message.forcePlugin === true) {
            chrome.tabs.get(msg.tabId, (tab) => {
                storeTabAndUrl(tab.id, tab.url);
                chrome.tabs.update(tab.id, { url: "plugin.html" });
            })
        }
        // restore url
        else if (msg.message.forcePlugin === false) {
            chrome.tabs.get(msg.tabId, (tab) => {
                const url = knownTabs[tab.id];
                deleteTabFromHbbTvPlugin(tab.id);
                chrome.tabs.update(tab.id, { url });
            })
        }
    } else {
        // unknown type
        sendResponse({ type: "error" });
    }
    return;
})