import * as channelListTemplate from "./channel-list-template.html";
import * as channels from "../../data/channels.json";

export class ChannelList {
  constructor(node, messageHandler) {
    node.insertAdjacentHTML("beforeend", channelListTemplate); // insert template into page
    this.messageHandler = messageHandler;
    this.elem = document.getElementById("channel-list-menu");
    this.channels = channels.default;

    this.messageHandler.subscribe(
      "iframeLocation",
      this.onIframeLocation.bind(this)
    );
  }

  initialize() {
    document.getElementById("channel-list-button").onclick = () => {
      this.toggleView();
    };
    document
      .getElementById("channel-filter-input")
      .addEventListener("keyup", this.filterChannels);

    this.hideView();
    this.render();
  }

  onIframeLocation(data) {
    const channelId = this.getUrlParam("id", data.href);
    const listItem = document
      .getElementsByClassName("channel-list-item")
      .namedItem(channelId);

    listItem && listItem.classList.add("active");
  }

  render() {
    const channelList = document.querySelector(".channel-list-container");
    const ul = document.createElement("ul");
    ul.classList.add("channel-list");
    const template = document.querySelector("#channel-list-item-template");

    this.channels.forEach(channel => {
      const channelListItemTemplate = document.importNode(
        template.content,
        true
      );
      const channelListItem = channelListItemTemplate.querySelector(
        ".channel-list-item"
      );
      channelListItem.querySelector(".id").textContent = channel.id;
      channelListItem.querySelector(".name").textContent = channel.channel.name;
      channelListItem.id = channel.id;
      channelListItem.onclick = () => {
        this.onChannelItemClick(channel);
      };

      ul.appendChild(channelListItemTemplate);
    });

    channelList.appendChild(ul);
  }

  filterChannels() {
    const filterValue = document
      .getElementById("channel-filter-input")
      .value.toLowerCase();
    const ul = document.querySelector(".channel-list");
    const listItems = ul.querySelectorAll(".channel-list-item");
    for (let i = 0; i < listItems.length; i++) {
      let channelName = listItems[i].querySelector(".name").textContent;
      if (channelName.toLowerCase().indexOf(filterValue) > -1) {
        listItems[i].style.display = "";
      } else {
        listItems[i].style.display = "none";
      }
    }
  }

  onChannelItemClick(channel) {
    // Add channel id to appUrl  
    const appUrl = channel.appUrl + (channel.appUrl.indexOf("?") < 0 ? "?" : "&") + "id=" + channel.id;
    this._sendMessageToBackgroundScript({ type: "channelChange", data: { ...channel, appUrl: appUrl } });    
  }

  getChannelForId(id) {
    return this.channels.filter(channel => channel.id === id)[0];
  }

  showView() {
    this.elem.style.opacity = 0.8;
    this.elem.style.visibility = "visible";
  }

  hideView() {
    this.elem.style.opacity = 0;
    this.elem.style.visibility = "hidden";
  }

  toggleView() {
    this.elem.style.visibility === "hidden" ? this.showView() : this.hideView();
  }

  getUrlParam(key, url) {
    if (!key || !url) return "";
    const match = url.match("[?&]" + key + "=([^&]+)");
    if (match) return match[1];

    return "";
  }

  /**
   * Send message down the message bus.
   * @param {*} messageObj
   * @param {*} responseCallback
   */
  _sendMessageToBackgroundScript(messageObj, responseCallback) {
    chrome.runtime.sendMessage(messageObj, response => {
      responseCallback && responseCallback(response);
    });
  }
}
