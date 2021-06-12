const osascript = require('node-osascript');

const toggleMute = () => {
	const fileName = 'meet-toggle-mute.scpt';
	return new Promise((resolve, reject) => {
		osascript.executeFile(__dirname + '/applescripts/' + fileName, null, (err, result, raw) => {
			if (err) reject(err)
			resolve(result);
		})
	})
}

module.exports = { toggleMute }