const osascript = require('node-osascript');
const log = require('electron-log');

// timeout to pause mute polling to prevent bad loops
let delayTimeout = null;

const mute = async (muteState) => {
	if (!store.data.zoomSync) {
		return;
	}

	clearTimeout(delayTimeout);
	delayTimeout = delay(2000, () => { delayTimeout = null });
	await delay(100, () => { });

	const fileName = muteState ? 'zoom-set-muted.scpt' : 'zoom-set-unmuted.scpt';
	osascript.executeFile(__dirname + '/applescripts/' + fileName, null, (err, result, raw) => {
		if (err) {
			log.error(err)
			console.error(err)
		}
	})
}

const checkMutedState = () => {
	if (!store.data.zoomSync) {
		return null;
	}

	if (!!delayTimeout) {
		return null;
	}

	return new Promise((resolve, reject) => {
		const fileName = 'zoom-check-mute-state.scpt';
		osascript.executeFile(__dirname + '/applescripts/' + fileName, null, (err, result, raw) => {
			console.log('bt1', result)
			if (err) {
				log.info(err)
				reject(err)
			}

			// there may have been a timeout added between the calling of this function and finishing of the osascript
			if (!!delayTimeout) {
				resolve(null);
			}

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

const delay = (ms, cb) => setTimeout(cb, ms);

module.exports = { mute, checkMutedState }