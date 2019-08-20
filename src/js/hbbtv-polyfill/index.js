import { keyEventInit } from "./keyevent-init.js";
import { hbbtvFn } from "./hbbtv.js";
import { VideoHandler } from "./hbb-video-handler.js";

console.log("hbbtv-polyfill: load");

// set body position
document.body.style.position = "absolute";
document.body.style.width = "1280px";
document.body.style.height = "720px";

keyEventInit();
hbbtvFn();

new VideoHandler().initialize();

console.log("hbbtv-polyfill: loaded");
