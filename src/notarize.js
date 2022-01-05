const { notarize } = require("electron-notarize");

function notarizing(context) {
	const { electronPlatformName = 'darwin' } = context;
	if (electronPlatformName !== "darwin") {
		return;
	}

	return notarize({
		appBundleId: "moot.testing1.app",
		appPath: process.env.APP_DIR,
		appleId: process.env.APPLEID,
		appleIdPassword: process.env.APPLEIDPASS,
	});
};

notarizing({ electronPlatformName: 'darwin' })