const { BrowserWindow, ipcMain } = require('electron');
const path = require('path')

function createWindow(setMuteState) {
	const win = new BrowserWindow({
		width: 240,
		height: 130,
		frame: false,
		alwaysOnTop: true,
		titleBarStyle: "customButtonsOnHover",
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, "preload.js")
		}
	})

	win.loadFile(path.join(__dirname, "svelte/public/index.html"))
	// win.webContents.openDevTools()
	ipcMain.on('toMain', (sender, value) => {
		setMuteState(value);
	})

	const onReceiveMuteStateUpdate = (muted) => {
		!win.isDestroyed() && win.webContents.send("fromMain", muted);
	}

	return { onReceiveMuteStateUpdate }
};

module.exports = { createWindow };