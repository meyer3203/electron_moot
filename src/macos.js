const osascript = require('node-osascript');

const muteMacOS = (muted) => {
	if (muted) {
		osascript.execute('set volume input volume 0');
	} else {
		osascript.execute('set volume input volume 100');
	}
}

module.exports = { muteMacOS }