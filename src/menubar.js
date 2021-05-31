const { Menu, Tray } = require('electron')
const { menubar } = require('menubar');

const menubarUUID = "e1120524-f862-46d4-81a7-79ddb7c7a4ba";

const initMenubar = (setMuteState) => {
	// todo add ICO for Windows
	const tray = new Tray('./src/MuteOff.png', menubarUUID);
	tray.muted = false;
	tray.setIgnoreDoubleClickEvents(true); // macos only? todo check windows

	const mb = menubar(
		{
			showOnRightClick: true,
			tray,
			showDockIcon: true
		}
	);

	tray.on('click', () => {
		setMuteState(!tray.muted);
	})

	tray.on('right-click', () => {
		console.log('rclick')
	})

	const onReceiveMuteStateUpdate = (muted) => {
		if (muted) {
			tray.setImage('./src/MuteOn.png')
			tray.muted = true;
		} else {
			tray.setImage('./src/MuteOff.png')
			tray.muted = false;
		}
	}

	return { onReceiveMuteStateUpdate };
}

module.exports = { initMenubar };