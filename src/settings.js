const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow(setMuteState) {
	const win = new BrowserWindow({
		width: 800,
		height: 500,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, "preload.js")
		},
		// titleBarStyle: "customButtonsOnHover",
		frame: false,
	})

	win.loadURL(`file://${__dirname}/svelte/public/index.html#/settings`)
	// win.webContents.openDevTools()
	ipcMain.on('getConfigState', (event, value) => {
		event.returnValue = store.data;
	})

	ipcMain.on('updateConfigState', (event, data) => {
		try {
			Object.keys(data).map(key => {
				let value = data[key];
				console.log(`Setting ${key} to ${value}`)
				store.set(key, value);
			})
			console.log(store.data)
			event.returnValue = 'ok'; // success
		} catch (e) {
			console.log(e)
			event.returnValue = e; // failure
		}
	})
};

module.exports = { createWindow };