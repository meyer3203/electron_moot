const { app } = require('electron');

const { muteMacOS } = require('./macos');
const { initMenubar } = require('./menubar');
const { initBLE } = require('./ble');
const { createWindow } = require('./window');

const osascript = require('node-osascript');


const receiveMuteStateUpdateCallbacks = [];

const setMuteState = (muted) => {
  for (cb of receiveMuteStateUpdateCallbacks) {
    cb.call(null, muted);
  }

  switch (process.platform) {
    case 'darwin':
      muteMacOS(muted);
      break;
    case 'win32':
      break;
    default:
      console.log("Platform not supported: ", process.platform);
  }
}

app.whenReady().then(async () => {
  try {
    const window = createWindow(setMuteState);
    receiveMuteStateUpdateCallbacks.push(window.onReceiveMuteStateUpdate);

    const menubar = initMenubar(setMuteState);
    receiveMuteStateUpdateCallbacks.push(menubar.onReceiveMuteStateUpdate);

    const ble = await initBLE(setMuteState);
    receiveMuteStateUpdateCallbacks.push(ble.onReceiveMuteStateUpdate);
  } catch (e) {
    // todo remove
    osascript.execute('display dialog msg', { msg: e.toString() })
  }

  app.on('activate', () => {
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  };
});
