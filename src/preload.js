const {
	contextBridge,
	ipcRenderer
} = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
	send: (channel, data) => {
		ipcRenderer.send(channel, data);
	},
	sendSync: (channel, data) => {
		return ipcRenderer.sendSync(channel, data);
	},
	receive: (channel, func) => {
		// Deliberately strip event as it includes `sender` 
		ipcRenderer.on(channel, (event, ...args) => func(...args));
	}
});