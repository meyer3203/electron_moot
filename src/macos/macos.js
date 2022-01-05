const osascript = require('node-osascript');
const log = require('electron-log');

const mute = (muted) => {
	if (muted) {
		osascript.execute('set volume input volume 0', null, (err) => {
			if (err) {
				console.error(err)
			}
		});
	} else {
		osascript.execute('set volume input volume 100', null, (err) => {
			if (err) {
				console.error(err)
			}
		});
	}
}

module.exports = { mute }