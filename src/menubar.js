const { Menu, Tray } = require('electron')
const { menubar } = require('menubar');
const { createWindow: createSettingsWindow } = require('./settings');
const { createWindow: createToggleWindow } = require('./window')
const path = require('path');

const menubarUUID = "e1120524-f862-46d4-81a7-79ddb7c7a4ba";

let contextMenu;
let menubarRef;

const initMenubar = (setMuteState) => {
	// todo add ICO for Windows
	const tray = new Tray(path.join(__dirname, '../public/images/MuteOff.png'), menubarUUID);
	tray.muted = false;
	tray.setIgnoreDoubleClickEvents(true); // macos only? todo check windows

	const preferencesItem = { label: 'Preferences', click: createSettingsWindow };
	const reopenItem = { id: 'reopen', label: 'Re-open toggle window', click: createToggleWindow };
	const quitItem = { label: 'Quit Moot', role: "quit" };

	contextMenu = Menu.buildFromTemplate([
		preferencesItem,
		reopenItem,
		quitItem,
	])

	menubarRef = menubar(
		{
			showOnRightClick: true,
			tray,
			browserWindow: { // no window causes loading spinner
				width: 1,
				height: 1,
			},
			preloadWindow: true,
			// showDockIcon: true
		}
	);

	tray.on('click', () => {
		setMuteState(!tray.muted);
	})

	tray.on('right-click', () => {
		tray.popUpContextMenu(contextMenu);
	})

	const onReceiveMuteStateUpdate = (muted) => {
		if (muted) {
			tray.setImage(path.join(__dirname, '../public/images/MuteOn.png'))
			tray.muted = true;
		} else {
			tray.setImage(path.join(__dirname, '../public/images/MuteOff.png'))
			tray.muted = false;
		}
	}

	return { onReceiveMuteStateUpdate };
}

const toggleReopenState = (open) => {
	// console.log(contextMenu?.getApplicationMenu)
	// console.log(contextMenu?.getApplicationMenu?.items)
	// contextMenu?.getApplicationMenu()?.getMenuItemById('reopen')?.setEnabled(!open)
}

module.exports = { initMenubar, toggleReopenState };