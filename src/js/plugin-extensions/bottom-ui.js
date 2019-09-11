// This one needs to be loaded via webpack html-loader
import * as bottomUIHtmlTemplate from "./bottom-ui-template.html"

export class BottomUi {

    constructor() {
        this.bottomUiDiv;
    }
    
    start() {
        // add container
        const body = document.getElementsByTagName("body")[0];
        body.insertAdjacentHTML("beforeend", bottomUIHtmlTemplate); // insert template into page
    }
}


