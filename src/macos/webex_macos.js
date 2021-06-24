const osascript = require('node-osascript');

let delayTimeout = null;

const mute = async (muteState) => {
	if (!store.data.webexSync) {
		return;
	}

	clearTimeout(delayTimeout);
	delayTimeout = delay(2000, () => { delayTimeout = null });
	await delay(100, () => { });

	const fileName = muteState ? 'webex-set-muted.scpt' : 'webex-set-unmuted.scpt';
	osascript.executeFile(__dirname + '/applescripts/' + fileName, null, (err, result, raw) => {
		console.log("Setting webex state: ", fileName)
		if (err) console.error(err)
	})
}

const checkMutedState = async () => {
	if (!store.data.webexSync) {
		return null;
	}

	if (!(delayTimeout === null || delayTimeout === undefined)) {
		return null;
	}

	return new Promise((resolve, reject) => {
		const fileName = 'webex-check-mute-state.scpt';
		osascript.executeFile(__dirname + '/applescripts/' + fileName, null, (err, result, raw) => {
			if (err) reject(err)

			if (!!delayTimeout) {
				resolve(null);
			}

			if (result === true) {
				resolve(true);
			} else if (result === false) {
				resolve(false);
			} else {
				resolve(null);
			}
		})
	})
}

const delay = (ms, cb) => setTimeout(cb, ms);

module.exports = { mute, checkMutedState }