const { Menu, Tray } = require('electron')
const { menubar } = require('menubar');
const path = require('path');

const menubarUUID = "e1120524-f862-46d4-81a7-79ddb7c7a4ba";

const initMenubar = (setMuteState) => {
	// todo add ICO for Windows
	const tray = new Tray(path.join(__dirname, '../public/images/MuteOff.png'), menubarUUID);
	tray.muted = false;
	tray.setIgnoreDoubleClickEvents(true); // macos only? todo check windows

	const contextMenu = Menu.buildFromTemplate([
		{ label: 'Item2', type: 'radio' },
		{ label: 'Quit', type: 'radio', role: "quit" },
	])

	const mb = menubar(
		{
			showOnRightClick: true,
			tray,
			browserWindow: {
				width: 0,
				height: 0,
			}
			// showDockIcon: true
		}
	);

	tray.on('click', () => {
		setMuteState(!tray.muted);
	})

	tray.on('right-click', () => {
		tray.popUpContextMenu(contextMenu);
		console.log('rclick')
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

module.exports = { initMenubar };