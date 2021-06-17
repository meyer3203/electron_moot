const osascript = require('node-osascript');

const toggleMute = () => {
	if (!store.data.meetSet) {
		return;
	}

	return new Promise((resolve, reject) => {
		osascript.executeFile(__dirname + '/applescripts/meet-toggle-mute.scpt', null, (err, result, raw) => {
			if (err) reject(err)
			resolve(result);
		})
	})
}

module.exports = { toggleMute }