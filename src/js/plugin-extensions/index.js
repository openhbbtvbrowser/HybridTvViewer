// compiled and injected into dom by webpack
import "../../css/hbb-extension-content-ui.scss";
import {BottomUi} from "./bottom-ui";
import {RemoteControl} from "./remote-control";
import { MessageHandler } from "../shared/message-handler";

const iframeElem = document.getElementById("iframe-plugin");
const messageHandler = new MessageHandler(window, iframeElem.contentWindow);

const bottomUi = new BottomUi(messageHandler);
bottomUi.initialize();

const remoteControl = new RemoteControl(document.body, messageHandler, iframeElem);
remoteControl.initialize();

