const { BrowserWindow, ipcMain } = require('electron');
const path = require('path')

let win;

function createWindow(setMuteState) {
	win = new BrowserWindow({
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

	win.loadURL(`file://${__dirname}/svelte/public/index.html#/toggle`)
	// win.webContents.openDevTools()
	ipcMain.on('muteStateToMain', (sender, value) => {
		setMuteState(value);
	})

	const onReceiveMuteStateUpdate = (muted) => {
		!win.isDestroyed() && win.webContents.send("muteStateFromMain", muted);
	}

	return { onReceiveMuteStateUpdate }
};

const onSetAlwaysOnTop = (alwaysOnTop) => {
	console.log('bt1', alwaysOnTop)
	win?.setAlwaysOnTop(alwaysOnTop);
	win?.show();
}

module.exports = { createWindow, onSetAlwaysOnTop };