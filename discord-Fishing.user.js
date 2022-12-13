// ==UserScript==
// @name            Discord fisher man
// @description     Fishes on discord
// @version         1.0.2
// @author          Tveka
// @homepageURL
// @supportURL
// @match           https://*.discord.com/app
// @match           https://*.discord.com/channels/*
// @match           https://*.discord.com/login
// @license         MIT
// @namespace
// @grant           none
// ==/UserScript==
window.onload = (function () {
  let fishingActive = false;
  const authToken = getToken();
  console.log(authToken);
  mountBtn();

  const fishBtn = document.createElement("button");
  fishBtn.textContent = "Go fish!";
  fishBtn.onclick = fishBtnClick;

  const discordElm = document.querySelector("#app-mount");
  let observerThrottle = null;
  const observer = new MutationObserver((_mutationsList, _observer) => {
    if (observerThrottle) return;
    observerThrottle = setTimeout(() => {
      observerThrottle = null;
      if (!discordElm.contains(fishBtn)) mountBtn(); // re-mount the button to the toolbar
    }, 3000);
  });

  function fishBtnClick() {
    fishingActive = !fishingActive;
    console.log(fishingActive);

    console.log(authToken);
    const tokenStupid = authToken;

    const channelId = getChannelId();
    console.log(channelId);

    setInterval(async function () {
      if (fishingActive) {
        await sendMessage(channelId, tokenStupid);
        console.log("sent message");
      }
    }, 5000);
  }

  // add button to toolbar
  function mountBtn() {
    const toolbar = document.querySelector("#app-mount [class^=toolbar]");
    if (toolbar) {
      toolbar.appendChild(fishBtn);
    }
  }

  observer.observe(discordElm, {
    attributes: false,
    childList: true,
    subtree: true,
  });

  // get tokens etc
  function getToken() {
    window.dispatchEvent(new Event("beforeunload"));
    const LS = document.body.appendChild(document.createElement("iframe"))
      .contentWindow.localStorage;
    return JSON.parse(LS.token);
  }

  function getChannelId() {
    const m = location.href.match(/channels\/([\w@]+)\/(\d+)/);
    if (m) return m[2];
    else
      alert(
        "Could not the Channel ID!\nPlease make sure you are on a Channel or DM."
      );
  }
})();

async function sendMessage(channelId, authTokenImport) {
  const message = "Fishing for gold";
  // const messageBody = '{"content": ' + message + ',"tts":false}';
  const messageBody = '{"content":"fiskar","tts":false}';

  const apiUrl =
    "https://discord.com/api/v9/channels/" + channelId + "/messages";

  await fetch(apiUrl, {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:107.0) Gecko/20100101 Firefox/107.0",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/json",
      Authorization: authTokenImport,
      "X-Super-Properties":
        "eyJvcyI6IldpbmRvd3MiLCJicm93c2VyIjoiRmlyZWZveCIsImRldmljZSI6IiIsInN5c3RlbV9sb2NhbGUiOiJlbi1VUyIsImJyb3dzZXJfdXNlcl9hZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQ7IHJ2OjEwNy4wKSBHZWNrby8yMDEwMDEwMSBGaXJlZm94LzEwNy4wIiwiYnJvd3Nlcl92ZXJzaW9uIjoiMTA3LjAiLCJvc192ZXJzaW9uIjoiMTAiLCJyZWZlcnJlciI6IiIsInJlZmVycmluZ19kb21haW4iOiIiLCJyZWZlcnJlcl9jdXJyZW50IjoiIiwicmVmZXJyaW5nX2RvbWFpbl9jdXJyZW50IjoiIiwicmVsZWFzZV9jaGFubmVsIjoic3RhYmxlIiwiY2xpZW50X2J1aWxkX251bWJlciI6MTYzNjU4LCJjbGllbnRfZXZlbnRfc291cmNlIjpudWxsfQ==",
      "X-Discord-Locale": "en-US",
      "X-Debug-Options": "bugReporterEnabled",
      "Alt-Used": "discord.com",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "Sec-GPC": "1",
    },

    body: '{"content":"Fishing","tts":false}',
    method: "POST",
    mode: "cors",
  });
}
