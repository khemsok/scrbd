chrome.action.onClicked.addListener((tab) => {
  if (tab.id && (tab.url?.includes("youtube.com/watch") || tab.url?.includes("youtube.com/shorts/"))) {
    chrome.tabs.sendMessage(tab.id, { type: "SCRBD_TOGGLE" });
  }
});
