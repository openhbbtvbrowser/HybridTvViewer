
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
 * If url and tab indicate an hbbtv app inject hbbtv_polyfill into page.
 * Add this on completed DOM as we need to access to e.g. OIPF video objects.
 */
chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
    if (knownTabs[details.tabId] && details.url.includes(knownTabs[details.tabId])) { // knownTabs[details.tabId] might be without params and details.url with
        chrome.tabs.executeScript(details.tabId, {
            file: 'content_script.js',
            runAt: 'document_start'
        });
        chrome.browserAction.setIcon({ tabId: details.tabId, path: "TV_active_128.png" });
    }
});

/**
 * Filter headers for hbbtv content-types.
 */
chrome.webRequest.onHeadersReceived.addListener(
    function (info) {
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
                        header.value = 'application/xhtml+xml'; // override current content-type to avoid browser automatic download
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
