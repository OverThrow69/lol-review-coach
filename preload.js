const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("leagueAPI", {
  getProfile: () => ipcRenderer.invoke("league:get-profile"),
  getContext: () => ipcRenderer.invoke("league:get-context"),
  getLatestPatch: () => ipcRenderer.invoke("league:get-latest-patch"),
});

contextBridge.exposeInMainWorld("appUpdates", {
  check: () => ipcRenderer.invoke("update:check"),
  restart: () => ipcRenderer.invoke("update:restart"),
  onStatus: (callback) => ipcRenderer.on("update:status", (_event, status) => callback(status)),
});

contextBridge.exposeInMainWorld("externalLinks", {
  open: (url) => ipcRenderer.invoke("open:url", url),
});

contextBridge.exposeInMainWorld("liveOverlay", {
  show: (x, y) => ipcRenderer.invoke("overlay:show", x, y),
  hide: () => ipcRenderer.invoke("overlay:hide"),
  push: (data) => ipcRenderer.invoke("overlay:push", data),
});
