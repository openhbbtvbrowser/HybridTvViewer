
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

// store tabs that are hbbtv tabs to knownTabsArray with url
var storeTabAndUrl = (tabId, url) => {
    knownTabs[tabId] = url;
};

/**
 * If url and tab are probably hbbtv app add hbbtv_polyfill to page.
 * Only to this on completed DOM as we need to access tga video objects and stuff
 */
chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
    if (knownTabs[details.tabId] === details.url || details.url.indexOf("http://localhost:8001/loader.html") > -1) {
        chrome.tabs.executeScript(details.tabId, {
            file: 'content_script.js',
            runAt: 'document_start'
        });
        chrome.browserAction.setIcon({ tabId: details.tabId, path: "TV_active_128.png" });
    }
});

// -- Filtering browser's HTTP headers -------------------------------------
chrome.webRequest.onHeadersReceived.addListener(
    function (info) {
        info.responseHeaders.forEach(function (header) {
            // console.log('onHeadersReceived header: ', header);
        });
        //console.log("tabId", info.tabId, info.responseHeaders);
        var url = (info.url || ''), headers = info.responseHeaders;

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
                        // console.log('hbbtv-extension: onHeadersReceived -> hybrid url: ' + url);

                        header.value = 'application/xhtml+xml'; // override current content-type to avoid browser automatic download

                        // chrome.browserAction.setIcon && chrome.browserAction.setIcon({ path: '../img/tv-icon128-on.png' });
                        storeTabAndUrl(info.tabId, url);
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
