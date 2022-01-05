var signAsync = require('electron-osx-sign').signAsync

signAsync({
	app: process.env.APP_DIR,
	hardenedRuntime: true,
	"gatekeeper-assess": false,
	entitlements: '/Users/admin/Workspace/moot/electron_moot/entitlements.plist',
	"entitlements-inherit": '/Users/admin/Workspace/moot/electron_moot/entitlements.plist'
})
	.then(function () {
		console.log('bt1 success')
	})
	.catch(function (err) {
		console.error('bt2', err)
	})