const osascript = require('node-osascript');

const mute = (muteState) => {
	const fileName = muteState ? 'zoom-set-muted.scpt' : 'zoom-set-unmuted.scpt';
	osascript.executeFile(__dirname + '/applescripts/' + fileName, null, (err, result, raw) => {
		if (err) console.error(err)
	})
}

const checkMutedState = () => {
	const fileName = 'zoom-check-mute-state.scpt';
	return new Promise((resolve) => {
		osascript.executeFile(__dirname + '/applescripts/' + fileName, null, (err, result, raw) => {
			if (err) console.error(err)

			if (result === "Muted") {
				resolve(true);
			} else if (result === "Unmuted") {
				resolve(false);
			} else {
				resolve(null);
			}
		})
	})
}



module.exports = { mute, checkMutedState }