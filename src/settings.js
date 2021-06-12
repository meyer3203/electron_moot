const { BrowserWindow, ipcMain } = require('electron');
const path = require('path')

function createWindow(setMuteState) {
	const win = new BrowserWindow({
		width: 600,
		height: 800,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, "preload.js")
		}
	})

	win.loadFile(path.join(__dirname, "index.html"))
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