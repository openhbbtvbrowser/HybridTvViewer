import {BottomUi} from "./bottom-ui";
import {RemoteControl} from "./remote-control";


const bottomUi = new BottomUi();
bottomUi.start();

const remoteControl = new RemoteControl(document.body);
remoteControl.initialize();