const electron = require('electron');
const path = require('path');
const fs = require('fs');

const { onSetAlwaysOnTop } = require('./window');

class Store {
	constructor(opts) {
		// Renderer process has to get `app` module via `remote`, whereas the main process can get it directly
		// app.getPath('userData') will return a string of the user's app data directory path.
		const userDataPath = (electron.app || electron.remote.app).getPath('userData');
		this.path = path.join(userDataPath, opts.configName + '.json');
		this.data = parseDataFile(this.path, opts.defaults);
		this.callbacks = opts.callbacks;
		Object.keys(opts.callbacks).forEach((key) => {
			opts.callbacks[key]?.();
		})
	}

	get(key) {
		return this.data[key];
	}

	set(key, val) {
		this.data[key] = val;
		this.callbacks[key]?.(val);
		fs.writeFileSync(this.path, JSON.stringify(this.data));
	}
}

function parseDataFile(filePath, defaults) {
	try {
		const savedSettings = JSON.parse(fs.readFileSync(filePath));
		return {
			...defaults,
			...savedSettings
		}
	} catch (error) {
		return defaults;
	}
}

const store = new Store({
	configName: 'moot-settings',
	defaults: {
		alwaysOnTop: true,
		zoomSet: true,
		zoomListen: true,
		webexSet: true,
		webexListen: true,
		meetSet: false,
	},
	callbacks: {
		alwaysOnTop: onSetAlwaysOnTop,
	}
})

global.store = store;