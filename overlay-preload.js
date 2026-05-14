const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("overlayBridge", {
  onUpdate: (callback) => ipcRenderer.on("overlay:data", (_event, data) => callback(data)),
  hide: () => ipcRenderer.invoke("overlay:hide"),
});
