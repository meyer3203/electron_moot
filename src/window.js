const { BrowserWindow, ipcMain } = require('electron');
const path = require('path')
const { scanBLE, registerConnectedCb, registerDisconnectedCb, cleanup } = require('./ble')

let win;

function initWindow(setMuteState) {
	createWindow();

	ipcMain.on('muteStateToMain', (sender, value) => {
		setMuteState(value);
	})

	ipcMain.on('searchForDevices', (sender, value) => {
		console.log("searching...")
		scanBLE()
	})

	ipcMain.on('disconnect', (sender, value) => {
		cleanup()
	})

	const onReceiveMuteStateUpdate = (muted) => {
		!win?.isDestroyed() && win?.webContents.send("muteStateFromMain", muted);
	}
	return { onReceiveMuteStateUpdate }
}

function createWindow() {
	if (win == null) {
		win = new BrowserWindow({
			width: 240,
			height: 130,
			frame: false,
			alwaysOnTop: store.data.alwaysOnTop,
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

		win.on('closed', () => {
			win = null;
		})
	}
};

function connectedCallback() {
	!win?.isDestroyed() && win?.webContents.send("connectedFromMain", true);
}

function disconnectedCallback() {
	!win?.isDestroyed() && win?.webContents.send("disconnectedFromMain", true);
}

registerConnectedCb(connectedCallback)
registerDisconnectedCb(disconnectedCallback)

function closeWindow() {
	win?.close();
}

const onSetAlwaysOnTop = (alwaysOnTop) => {
	win?.setAlwaysOnTop(alwaysOnTop);
	win?.show();
}

// prevents cyclical dependency
module.exports.initWindow = initWindow;
module.exports.createWindow = createWindow;
module.exports.closeWindow = closeWindow;
module.exports.onSetAlwaysOnTop = onSetAlwaysOnTop;
module.exports.connectedCallback = connectedCallback;
module.exports.disconnectedCallback = disconnectedCallback;