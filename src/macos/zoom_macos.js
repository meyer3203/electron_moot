const osascript = require('node-osascript');

const mute = (muteState) => {
	const fileName = muteState ? 'zoom-set-muted.scpt' : 'zoom-set-unmuted.scpt';
	osascript.executeFile(__dirname + '/applescripts/' + fileName, null, (err, result, raw) => {
		if (err) console.error(err)
	})
}

const checkMutedState = () => {
	return new Promise((resolve, reject) => {
		const fileName = 'zoom-check-mute-state.scpt';
		osascript.executeFile(__dirname + '/applescripts/' + fileName, null, (err, result, raw) => {
			if (err) reject(err)

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